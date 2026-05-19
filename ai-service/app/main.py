from sentence_transformers import SentenceTransformer, util
from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image
import cv2
import os
import subprocess

from fastapi import FastAPI, UploadFile, File, Form, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

app = FastAPI()

os.makedirs("clips", exist_ok=True)
os.makedirs("frames", exist_ok=True)

app.mount("/clips", StaticFiles(directory="clips"), name="clips")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

processor = None
model = None
embedder = None

@app.get("/")
def root():
    return {"message": "AI Service Running"}


LAST_VIDEO_PATH = None


@app.post("/process")
async def process_video(
    video: UploadFile = File(...),
    query: str = Form(...)
):
    global LAST_VIDEO_PATH

    global processor, model, embedder

    if processor is None:
        processor = BlipProcessor.from_pretrained(
            "Salesforce/blip-image-captioning-base"
        )

    if model is None:
        model = BlipForConditionalGeneration.from_pretrained(
            "Salesforce/blip-image-captioning-base"
        )

    if embedder is None:
        embedder = SentenceTransformer("all-MiniLM-L6-v2")

    print("Received query:", query)
    print("Received file:", video.filename)

    video_path = f"temp_{video.filename}"
    LAST_VIDEO_PATH = video_path

    with open(video_path, "wb") as f:
        f.write(await video.read())

    os.makedirs("frames", exist_ok=True)

    cap = cv2.VideoCapture(video_path)

    frame_count = 0
    saved_frames = 0

    while True:
        success, frame = cap.read()
        if not success:
            break
   
        if frame_count % 30 == 0:
            frame_path = f"frames/frame_{saved_frames}.jpg"
            cv2.imwrite(frame_path, frame)
            saved_frames += 1

        frame_count += 1

    cap.release()

    print(f"Total frames extracted: {saved_frames}")

    captions = []

    for i in range(saved_frames):
        frame_path = f"frames/frame_{i}.jpg"

        image = Image.open(frame_path).convert("RGB")

        inputs = processor(images=image, return_tensors="pt")
        out = model.generate(**inputs)

        caption = processor.decode(out[0], skip_special_tokens=True)

        captions.append({
            "frame": i,
            "caption": caption
        })

    caption_texts = [c["caption"] for c in captions]

    unique = []
    for cap in caption_texts:
        cap = cap.replace("folded folded", "folded")
        if cap not in unique:
            unique.append(cap)

    summary = unique[0] if len(unique) > 0 else "No summary available"

    caption_embeddings = embedder.encode(caption_texts, convert_to_tensor=True)

    expanded_queries = [query]
    query_lower = query.lower()

    if any(word in query_lower for word in ["work", "activity", "doing"]):
        expanded_queries += ["doing something", "handling objects"]

    if any(word in query_lower for word in ["angry"]):
        expanded_queries += ["shouting", "yelling", "frustrated"]

    if any(word in query_lower for word in ["walk"]):
        expanded_queries += ["walking", "moving"]

    if any(word in query_lower for word in ["talk"]):
        expanded_queries += ["speaking", "conversation"]

    final_query = " ".join(expanded_queries)

    query_embedding = embedder.encode(final_query, convert_to_tensor=True)

    similarities = util.cos_sim(query_embedding, caption_embeddings)[0]

    results = []

    for i, score in enumerate(similarities):
        score = float(score)

        if score > 0.25:
            results.append({
                "time": f"00:{i:02d} - 00:{i+1:02d}",
                "caption": captions[i]["caption"],
                "score": round(score, 2)
            })

    results = sorted(results, key=lambda x: x["score"], reverse=True)[:5]

    return {
        "results": results,
        "summary": summary
    }


@app.post("/extract")
async def extract_clip(data: dict = Body(...)):
    global LAST_VIDEO_PATH

    time_range = data.get("time")

    time = time_range.split(" - ")[0]

    print("Extract request for:", time)

    if not LAST_VIDEO_PATH or not os.path.exists(LAST_VIDEO_PATH):
        return {"error": "No video found"}

    os.makedirs("clips", exist_ok=True)

    output_path = f"clips/clip_{time.replace(':', '_')}.mp4"

    command = [
        "ffmpeg",
        "-y",
        "-i", LAST_VIDEO_PATH,
        "-ss", time,
        "-t", "2",
        "-c:v", "libx264",
        "-preset", "ultrafast",
        "-crf", "28",
        output_path
    ]

    result = subprocess.run(
        command,
        capture_output=True,
        text=True
    )
    print("FFMPEG OUTPUT:", result.stdout)
    print("FFMPEG ERROR:", result.stderr)

    return FileResponse(
        path=output_path,
        filename="clip.mp4",
        media_type="video/mp4"
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
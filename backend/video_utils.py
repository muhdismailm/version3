import subprocess
import os


UPLOAD_FOLDER = "uploads"
AUDIO_FOLDER = os.path.join(UPLOAD_FOLDER, "audio")


def has_audio(video_path):
    """
    Returns True if video contains an audio stream.
    Uses FFmpeg to probe audio stream.
    """
    try:
        command = ["ffmpeg", "-i", video_path]

        result = subprocess.run(
            command,
            stderr=subprocess.PIPE,
            stdout=subprocess.PIPE,
            text=True
        )

        return "Audio:" in result.stderr

    except Exception as e:
        print("Audio check error:", e)
        return False


def extract_audio(video_path):
    """
    Extracts audio from video and saves as WAV (16kHz mono)
    inside uploads/audio folder.
    """

    if not has_audio(video_path):
        raise ValueError("No audio stream found in video.")

    # Ensure uploads/audio folder exists
    os.makedirs(AUDIO_FOLDER, exist_ok=True)

    # Generate output filename from video name
    base_name = os.path.splitext(os.path.basename(video_path))[0]
    output_audio_path = os.path.join(AUDIO_FOLDER, base_name + ".wav")

    try:
        command = [
            "ffmpeg",
            "-y",
            "-i", video_path,
            "-vn",
            "-acodec", "pcm_s16le",
            "-ar", "16000",
            "-ac", "1",
            output_audio_path
        ]

        subprocess.run(command, check=True)

        if not os.path.exists(output_audio_path):
            raise RuntimeError("Audio extraction failed.")

        print("Audio saved at:", os.path.abspath(output_audio_path))

        return output_audio_path  # Return path for further processing

    except subprocess.CalledProcessError as e:
        print("FFmpeg extraction error:", e)
        raise

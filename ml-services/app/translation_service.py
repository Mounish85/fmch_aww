from transformers import AutoTokenizer, AutoModelForSeq2SeqLM


MODEL_NAME = "facebook/nllb-200-distilled-600M"


SUPPORTED_LANGUAGES = {
    "en": {
        "name": "English",
        "code": "eng_Latn",
    },
    "te": {
        "name": "Telugu",
        "code": "tel_Telu",
    },
    "hi": {
        "name": "Hindi",
        "code": "hin_Deva",
    },
    "ta": {
        "name": "Tamil",
        "code": "tam_Taml",
    },
    "kn": {
        "name": "Kannada",
        "code": "kan_Knda",
    },
}


print("Loading NLLB translation model...")

tokenizer = AutoTokenizer.from_pretrained(
    MODEL_NAME
)

model = AutoModelForSeq2SeqLM.from_pretrained(
    MODEL_NAME
)

print("NLLB translation model loaded.")


def validate_language(language):
    if not language:
        return "en"

    language = language.strip().lower()

    if language not in SUPPORTED_LANGUAGES:
        raise ValueError(
            f"Unsupported language: {language}"
        )

    return language


async def translate_text(
    text,
    source_language,
    target_language
):
    if not text:
        raise ValueError("Text is required for translation")

    source_language = validate_language(
        source_language
    )

    target_language = validate_language(
        target_language
    )

    if source_language == target_language:
        return text

    source_code = SUPPORTED_LANGUAGES[
        source_language
    ]["code"]

    target_code = SUPPORTED_LANGUAGES[
        target_language
    ]["code"]

    tokenizer.src_lang = source_code

    inputs = tokenizer(
        text,
        return_tensors="pt"
    )

    translated_tokens = model.generate(
        **inputs,
        forced_bos_token_id=tokenizer.convert_tokens_to_ids(
            target_code
        ),
        max_length=128
    )

    translated_text = tokenizer.batch_decode(
        translated_tokens,
        skip_special_tokens=True
    )[0]

    return translated_text


async def translate_recommendation(
    recommendation,
    source_language,
    target_language
):
    if not recommendation:
        raise ValueError(
            "Recommendation is required"
        )

    translated_title = await translate_text(
        recommendation.get("title", ""),
        source_language,
        target_language
    )

    translated_message = await translate_text(
        recommendation.get("message", ""),
        source_language,
        target_language
    )

    return {
        "title": translated_title,
        "message": translated_message,
    }
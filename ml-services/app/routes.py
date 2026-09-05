from fastapi import APIRouter, HTTPException

from backend_service import (
    get_counselling_from_backend,
    get_user_from_backend
)

from empirical_service import prepare_empirical_data
from prediction_service import generate_prediction
from translation_service import (
    translate_recommendation,
    translate_text
)


router = APIRouter(
    prefix="/api/ml",
    tags=["ML"]
)


@router.post("/predict/{counselling_id}")
async def predict(counselling_id: str):

    try:
        # 1. Get actual counselling data
        #    from the Node.js backend
        counselling = await get_counselling_from_backend(
            counselling_id
        )

        # 2. Prepare empirical data
        empirical_data = prepare_empirical_data(
            counselling
        )

        # 3. Generate contextual decision support
        result = generate_prediction(
            empirical_data
        )

        # 4. Get the User who conducted
        #    the counselling
        conducted_by = counselling.get("conductedBy")

        if not conducted_by:
            raise ValueError(
                "Counselling record does not contain conductedBy"
            )

        if isinstance(conducted_by, dict):
            if "preferredLanguage" in conducted_by:
                user = conducted_by
            else:
                user_id = conducted_by.get("_id") or conducted_by.get("id")
                user = await get_user_from_backend(str(user_id))
        else:
            user = await get_user_from_backend(str(conducted_by))

        # 5. Get the user's preferred language
        language = user.get(
            "preferredLanguage",
            "en"
        )

        # 6. Our prediction recommendation
        #    is currently generated in English
        source_language = "en"

        # 7. Translate recommendation
        #    from English to selected language
        translated_recommendation = (
            await translate_recommendation(
                result["recommendation"],
                source_language,
                language
            )
        )

        # 8. Replace English recommendation
        #    with translated recommendation
        result["recommendation"] = (
            translated_recommendation
        )

        # 9. Return final result
        return {
            "success": True,
            "counsellingId": counselling_id,
            "result": result,
            "language": language
        }

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


@router.post("/translate")
async def translate_endpoint(payload: dict):
    try:
        source_language = payload.get("source_language", "en")
        target_language = payload.get("target_language", "en")
        recommendation = payload.get("recommendation")

        if recommendation and isinstance(recommendation, dict):
            translated = await translate_recommendation(
                recommendation, source_language, target_language
            )
            return {
                "success": True,
                "translated": translated,
                "targetLanguage": target_language,
            }

        text = payload.get("text", "")
        if not text:
            raise ValueError("Text or recommendation is required for translation")

        translated_text = await translate_text(
            text, source_language, target_language
        )
        return {
            "success": True,
            "translatedText": translated_text,
            "targetLanguage": target_language,
        }
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))
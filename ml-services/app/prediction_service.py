def _normalize(value):
    """
    Normalize a value for context detection.
    """
    if value is None:
        return ""

    if isinstance(value, str):
        return value.strip().lower()

    return str(value).strip().lower()


def _detect_context(inputs):
    """
    Detect the main counselling context from the actual
    counselling inputs received from the Node.js backend.

    No mock or synthetic data is used.
    """

    text = _normalize(inputs)

    contexts = []

    # Nutrition / food
    if any(
        keyword in text
        for keyword in [
            "nutrition",
            "food",
            "diet",
            "feeding",
            "meal",
            "eating",
        ]
    ):
        contexts.append({
            "context": "nutrition",
            "weight": 3,
        })

    # Breastfeeding
    if any(
        keyword in text
        for keyword in [
            "breastfeeding",
            "breast feeding",
            "breast milk",
            "lactation",
        ]
    ):
        contexts.append({
            "context": "breastfeeding",
            "weight": 4,
        })

    # Child wellbeing
    if any(
        keyword in text
        for keyword in [
            "child",
            "baby",
            "infant",
            "growth",
            "weight",
            "wellbeing",
        ]
    ):
        contexts.append({
            "context": "child_wellbeing",
            "weight": 3,
        })

    # Maternal wellbeing
    if any(
        keyword in text
        for keyword in [
            "mother",
            "maternal",
            "pregnancy",
            "pregnant",
            "mother wellbeing",
        ]
    ):
        contexts.append({
            "context": "maternal_wellbeing",
            "weight": 3,
        })

    return contexts


def _calculate_priority(contexts):
    """
    Determine counselling priority from the contextual
    signals found in the actual backend input.
    """

    if not contexts:
        return "low"

    score = sum(context["weight"] for context in contexts)

    if score >= 7:
        return "high"

    if score >= 4:
        return "medium"

    return "low"


def _calculate_confidence(contexts):
    """
    Calculate a simple contextual confidence score.

    This is NOT a trained ML probability.
    It represents the strength of the detected context.
    """

    if not contexts:
        return 0.0

    score = sum(context["weight"] for context in contexts)

    confidence = min(score / 10, 1.0)

    return round(confidence, 2)


def _generate_recommendation(contexts):
    """
    Generate a simple, direct counselling message.

    The message is written so that the AWW can communicate
    it directly to the mother.

    These are counselling messages, not medical diagnoses.
    """

    if not contexts:
        return {
            "title": "More information needed",
            "message": (
                "Please tell me a little more about the concern "
                "so I can give you more relevant guidance."
            ),
        }

    context_names = {
        context["context"]
        for context in contexts
    }

    # Most specific/high-priority context first
    if "breastfeeding" in context_names:
        return {
            "title": "Breastfeeding",
            "message": (
                "Please continue breastfeeding your child "
                "and follow the breastfeeding practices "
                "discussed during counselling."
            ),
        }

    if "nutrition" in context_names:
        return {
            "title": "Nutrition",
            "message": (
                "Please give your child nutritious food regularly "
                "and include a variety of foods in their meals."
            ),
        }

    if "child_wellbeing" in context_names:
        return {
            "title": "Child Wellbeing",
            "message": (
                "Please give your child proper care and attention "
                "and continue the healthy practices discussed "
                "during counselling."
            ),
        }

    if "maternal_wellbeing" in context_names:
        return {
            "title": "Mother's Wellbeing",
            "message": (
                "Please take care of yourself, eat well, "
                "rest properly, and follow the guidance "
                "discussed during counselling."
            ),
        }

    return {
        "title": "Counselling Guidance",
        "message": (
            "Please follow the healthy practices discussed "
            "during counselling."
        ),
    }


def _identify_missing_information(inputs):
    """
    Identify whether usable counselling input was supplied.

    We never create missing information ourselves.
    """

    if inputs is None:
        return ["Counselling inputs"]

    if isinstance(inputs, dict) and not inputs:
        return ["Counselling context"]

    if isinstance(inputs, str) and not inputs.strip():
        return ["Counselling context"]

    return []


def generate_prediction(empirical_data):
    """
    Main decision-support function.

    IMPORTANT:
    All operational input comes from the Node.js backend.

    No mock, synthetic, manually created patient data,
    or hard-coded prediction data is used.
    """

    if not empirical_data:
        raise ValueError("Empirical data is required")

    inputs = empirical_data.get("inputs")

    if inputs is None:
        raise ValueError("Counselling inputs are required")

    # Check whether sufficient context exists
    missing_information = _identify_missing_information(inputs)

    # Detect counselling context from backend data
    contexts = _detect_context(inputs)

    # Determine priority
    priority = _calculate_priority(contexts)

    # Determine contextual confidence
    confidence = _calculate_confidence(contexts)

    # Generate direct mother-facing counselling message
    recommendation = _generate_recommendation(contexts)

    return {
        "decisionType": "contextual_counselling_support",

        "priority": priority,

        "confidence": confidence,

        "identifiedContexts": [
            context["context"]
            for context in contexts
        ],

        "recommendation": recommendation,

        "missingInformation": missing_information,

        "source": "node_backend",
    }
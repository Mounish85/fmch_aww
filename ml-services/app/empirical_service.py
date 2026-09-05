def prepare_empirical_data(counselling):
    if not counselling:
        raise ValueError(
            "Counselling data is required"
        )

    inputs = counselling.get("inputs")

    if inputs is None:
        raise ValueError(
            "Counselling inputs are missing"
        )

    return {
        "beneficiary": counselling.get(
            "beneficiary"
        ),
        "conductedBy": counselling.get(
            "conductedBy"
        ),
        "inputs": inputs,
    }
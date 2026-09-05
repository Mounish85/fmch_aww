import asyncio

from translation_service import translate_text


async def main():

    result = await translate_text(
        "Please give your child nutritious food regularly.",
        "en",
        "te"
    )

    print()
    print("English:")
    print("Please give your child nutritious food regularly.")

    print()
    print("Telugu:")
    print(result)


asyncio.run(main())
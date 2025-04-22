import random

"""
    Generates a random string based on the given characters and their probabilities.

    Args:
        chars (str): A string containing the characters to choose from.
        probs (list): A list of probabilities corresponding to each character in `chars`.

    Returns:
        str: A randomly generated string.
"""
def gen(chars, probs):
   
    return ''.join(random.choices(chars, probs, k=10))
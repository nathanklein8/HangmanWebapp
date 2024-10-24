def filter_words(input_file, output_file):
    with open(input_file, 'r') as file:
        words = file.readlines()

    # Remove words with less than 6 characters and strip any whitespace
    filtered_words = [word.strip() for word in words if len(word.strip()) > 5]

    # Write the filtered words to the output file
    with open(output_file, 'w') as file:
        file.write("\n".join(filtered_words))

# Example usage:
input_file = 'words.txt'  # Input file containing words
output_file = 'filtered_words.txt'  # Output file for filtered words

filter_words(input_file, output_file)


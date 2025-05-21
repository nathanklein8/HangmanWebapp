with open('wordlist.txt', 'r') as i:
    with open('filtered_words.txt', 'w') as o:
        words = i.readlines()
        words = [w.strip() for w in words]
        words = [w for w in words if len(w) > 6 and len(w) < 16]
        words = [w for w in words if w.isalpha()]
        o.writelines('\n$'.join(words).split('$'))
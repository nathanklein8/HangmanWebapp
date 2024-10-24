using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace RandomWordApi.Services
{
    public class RandomWordService
    {
        private readonly List<string> _words;

        public RandomWordService()
        {
            // Read the word list from a file
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "filtered_words.txt");
            _words = File.ReadAllLines(filePath).ToList();
        }

        public string GetRandomWord()
        {
            var random = new Random();
            int index = random.Next(_words.Count);
            return _words[index];
        }
    }
}


using Microsoft.AspNetCore.Mvc;
using RandomWordApi.Services;

namespace RandomWordApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RandomWordController : ControllerBase
    {
        private readonly RandomWordService _randomWordService;

        public RandomWordController(RandomWordService randomWordService)
        {
            _randomWordService = randomWordService;
        }

        [HttpGet]
        public IActionResult GetRandomWord()
        {
            var word = _randomWordService.GetRandomWord();
            return Ok(word);
        }
    }
}


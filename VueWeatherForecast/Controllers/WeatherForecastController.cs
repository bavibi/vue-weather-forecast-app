using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace VueWeatherForecast.Controllers
{
    [ApiController]
    [EnableCors]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Мороз",
            /*"Bracing",*/
            "Мёрзло",
            "Прохладно",
            "Средняя температура",
            "Тепло",
            /*"Balmy",*/
            "Жарко",
            /*"Sweltering",*/
            "Палящее солнце"
        };

        private static WeatherForecast[] _data = Enumerable.Range(1, 5)
            .Select(index => new WeatherForecast
            {
                Date = DateTime.Now.AddDays(index),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            })
            .ToArray();

        private readonly ILogger<WeatherForecastController> _logger;

        public WeatherForecastController(ILogger<WeatherForecastController> logger)
        {
            _logger = logger;
        }

        [HttpGet("WeatherForecasts")]
        public IEnumerable<WeatherForecast> Get()
        {
            return _data;
        }

        [HttpGet("WeatherForecasts/{id}")]
        public ActionResult<WeatherForecast> Get(int id)
        {
            if (id >= 0 && id < _data.Length)
            {
                return _data[id];
            }

            return NotFound();
        }
    }
}
import {z} from "zod"

const weatherFocecastSchema = z.object({
    date: z.string(),
    temperatureC: z.number().int(),
    temperatureF: z.number().int(),
    summary: z.string().nullish()
})
    .transform(wcast => {
        wcast.date = new Date(wcast.date).toLocaleDateString("ru-RU");
        return wcast;
    })

export type WeatherForecast = z.infer<typeof weatherFocecastSchema>;

const apiUrl = "https://192.168.122.71:5001";

function transformData() {

}

export default {
    async getAll(): Promise<WeatherForecast[]> {
        const fetchResult = await fetch(apiUrl + "/WeatherForecast/WeatherForecasts");
        const data = (await fetchResult.json()) as WeatherForecast[];
        return data.map(d => weatherFocecastSchema.parse(d));
    },

    async getById(id: number): Promise<WeatherForecast | null | Error> {
        if (!z.number().int().safeParse(id).success) throw new Error("id must be and integer");

        const fetchResult = await fetch(apiUrl + "/WeatherForecast/WeatherForecasts/" + id);
        if (fetchResult.status == 404) return null;
        if (!fetchResult.ok) return new Error(fetchResult.statusText);
        const data = (await fetchResult.json()) as WeatherForecast;
        return weatherFocecastSchema.parse(data);
    },
}
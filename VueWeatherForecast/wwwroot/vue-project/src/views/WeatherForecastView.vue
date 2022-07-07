<script setup lang="ts">
import type { WeatherForecast } from '@/services/WeatherForecast';
import weatherForecastService from "@/services/WeatherForecast.js";
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

  const errorMsg = ref(null as string | null);
  const wcast = ref(null as WeatherForecast | null);
  const route = useRoute();
  const wcastIdStr = ref("");
  if (typeof route.params.id == "string") {
    wcastIdStr.value = route.params.id;
  }
  else if (Array.isArray(route.params.id) && route.params.id.length > 0) {
    wcastIdStr.value = route.params.id[0];
  }
  const router = useRouter();
  
  async function fetchData() {
    const id = Number.parseInt(wcastIdStr.value);
    if (Number.isNaN(id)) {
      errorMsg.value = "Id дожен быть целым числом";
      return;
    }

    router.push({name: "weatherforecastByIdWithParam", params: { id }});

    const result = await weatherForecastService.getById(id);
    if (result == null) {
      errorMsg.value = "Не найдено";
    }
    else if (result instanceof Error) {
      errorMsg.value = `Ошибка: ${result.message}`;
    }
    else {
      errorMsg.value = "";
      wcast.value = result;
    }
  }

  if (wcastIdStr.value != "") {
    fetchData();
  }
</script>

<template>
  <div class="root">
    <label class="form-label">
      Id прогноза:
      <input type="number" class="form-control" v-model="wcastIdStr">
    </label>
    <button class="btn btn-primary" @click="fetchData">Найти</button>
    <div v-if="errorMsg" class="alert alert-danger" role="alert">{{errorMsg}}</div>
    <div v-if="wcast != null">
      <div>
        <label class="form-label">
          Дата 
          <input type="text" readonly class="form-control" :value="wcast?.date" />
        </label>
      </div>
      <div>
        <label class="form-label">
          Температура в градусац Цельсия
          <input type="text" readonly class="form-control" :value="wcast?.temperatureC" />
        </label>
      </div>
      <div>
        <label class="form-label">
          Температура в градусах Фаренгейта
          <input type="text" readonly class="form-control" :value="wcast?.temperatureF" />
        </label>
      </div>
      <div>
        <label class="form-label">
          Сводка
          <input type="text" readonly class="form-control" :value="wcast?.summary" />
        </label>
      </div>
    </div>
  </div>
</template>

<style>
  .root {
    padding: 10px 10px;
  }

  div {
    flex: 1 1;
  }

  .form-label {
    font-size: 20px;
  }
</style>

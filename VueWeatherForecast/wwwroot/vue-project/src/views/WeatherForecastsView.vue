<script setup lang="ts">
  import { ref, watchEffect } from 'vue';
  import weatherforecastsService from "@/services/WeatherForecast.js"
  import type { WeatherForecast } from '@/services/WeatherForecast.js';


  const temprType = ref("C" as "C" | "F");

  const weatherforecasts = ref([] as WeatherForecast[]);
  watchEffect(async () => {
    weatherforecasts.value = await weatherforecastsService.getAll();
  });
</script>

<template>
  <div class="root">
    <div class="container-fluid">
      <label>
        Мера измерения температуры:
        <select class="form-select" v-model="temprType">
          <option value="C" selected>Градусы Цельсия</option>
          <option value="F">Градусы Фаренгейта</option>
        </select>
      </label>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>
            Дата
          </th>
          <th>
            Температура в {{temprType == "C" ? "градусах Цельсия" : "градусах Фаренгейта"}}
          </th>
          <th>
            Сводка
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="wcast in weatherforecasts">
          <td>{{wcast.date}}</td>
          <td>{{temprType == "C" ? wcast.temperatureC : wcast.temperatureF}}</td>
          <td>{{wcast.summary}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
  .root {
    flex: 1 1;
  }
</style>

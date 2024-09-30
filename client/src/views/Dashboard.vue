<template>
  <div class="dashboard">
    <h1 class="mt-3 text-center">Dashboard</h1>

    <div class="charts">
      <!-- Gráfico de donut -->

      <div class="chart donut-chart">
        <h4 class="text-center">% Pagamento</h4>

        <VueApexCharts
          width="500"
          type="donut"
          :options="donutOptions"
          :series="donutSeries"
        ></VueApexCharts>
      </div>

      <!-- Gráfico de barras -->
      <div class="chart bar-chart">
        <h4 class="text-center">Cursos</h4>

        <VueApexCharts
          width="500"
          type="bar"
          :options="barOptions"
          :series="barSeries"
        ></VueApexCharts>
      </div>
    </div>

    <div class="payments">
      <hr />
      <h3 class="text-center">Últimos Pagamentos</h3>

      <table class="last-payments">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Valor</th>
            <th>Data</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(payment, paymentId) in lastPayments" :key="paymentId">
            <td data-label="Nome">{{ payment.name }}</td>
            <td data-label="Valor">R${{ payment.amount }}</td>
            <td data-label="Data">{{ payment.payment_date }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import VueApexCharts from "vue3-apexcharts";
import ip from "../ip";

export default {
  name: "Dashboard",
  components: {
    VueApexCharts,
  },
  data() {
    return {
      lastPayments: null,

      // Opções e dados do gráfico de barras
      barOptions: {
        chart: {
          id: "bar-chart",
        },
        xaxis: {
          categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
        },
      },
      barSeries: [
        {
          name: "series-1",
          data: [30, 40, 45, 50, 49, 60, 70, 91],
        },
      ],

      // Opções e dados do gráfico de donut
      donutOptions: {
        chart: {
          id: "donut-chart",
        },
        labels: ["Produto A", "Produto B", "Produto C", "Produto D"],
      },
      donutSeries: [44, 55, 41, 17],
    };
  },

  mounted() {
    this.getLastPayments();
  },

  methods: {
    getLastPayments() {
      axios
        .get(`${ip}/get-last-payments`)
        .then((response) => {
          console.log(response.data);
          this.lastPayments = response.data;
        })
        .catch((error) => {
          console.error("Erro ao consultar ultimos pagamentos", error);
        });
    },

    getCourseNumbers() {
      axios
        .get(`${ip}/get-client-relationship`)
        .then()
        .catch((error) => {
          console.error("Erro ao buscar relação de cursos: ", error);
        });
    },
  },
};
</script>

<style scoped>
.dashboard {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Chart */
.charts {
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 20px;
  margin: 30px;
}

.chart {
  box-shadow: 0 1rem 2rem rgba(132, 139, 200, 0.18);
  padding: 15px;
  border-radius: 20px;
  cursor: pointer;
}

.chart:hover {
  box-shadow: 0 5px 10px rgba(132, 139, 200, 0.18);
}

.bar-chart,
.donut-chart {
  margin-top: 20px;
}

/* Tabela */
.payments {
  width: 90%;
}

.last-payments {
  width: 100%;
  border-collapse: collapse;
  margin: 15px 0;
  font-size: 15px;
  font-family: "Arial", sans-serif;
  text-align: left;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.last-payments thead {
  background-color: #f4f4f9; /* Cabeçalho com cor leve */
}

.last-payments thead th {
  padding: 8px;
  background-color: #1f2937; /* Cor de fundo do cabeçalho */
  color: #ffffff; /* Cor do texto */
  text-transform: uppercase;
}

.last-payments tbody tr {
  border-bottom: 1px solid #dddddd; /* Linha divisória */
  transition: background-color 0.3s ease; /* Transição suave ao passar o mouse */
}

.last-payments tbody tr:hover {
  background-color: #f4f7fd; /* Cor de fundo ao passar o mouse */
}

.last-payments tbody td {
  padding: 12px;
  color: #333333;
  text-align: center !important;
}

.last-payments tbody td:last-child {
  font-weight: bold;
  color: #1f2937; /* Valor destacado */
}

.last-payments tbody td:nth-child(2) {
  text-align: right;
}

.last-payments tbody td:nth-child(3) {
  text-align: center;
}

/* Responsividade para telas menores */
@media (max-width: 768px) {
  .last-payments {
    font-size: 16px; /* Ajusta o tamanho da fonte */
  }

  .last-payments thead {
    display: none; /* Esconde o cabeçalho para melhor visualização mobile */
  }

  .last-payments tbody tr {
    display: block;
    margin-bottom: 10px;
    border: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Cada linha com sombra em mobile */
  }

  .last-payments tbody td {
    display: block;
    padding: 10px;
    text-align: right;
    border-bottom: 1px solid #dddddd;
    position: relative;
    padding-left: 50%;
  }

  .last-payments tbody td:before {
    content: attr(data-label);
    position: absolute;
    left: 10px;
    font-weight: bold;
    text-transform: uppercase;
  }

  .last-payments tbody td:last-child {
    border-bottom: none;
  }
}
</style>

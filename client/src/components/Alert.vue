<template>
  <v-dialog v-model="dialogShown" max-width="400">
    <v-card :color="corAlerta" dark>
      <v-card-title class="headline">
        <i class="material-icons-round opacity-10 fs-4">{{ iconeAlerta }}</i>
        {{ tituloAlerta }}
      </v-card-title>
      <v-card-text>
        {{ mensagemAlerta }}
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="dialogShown = false">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "Alert",
  data() {
    return {
      dialogShown: false,
      corAlerta: "",
      iconeAlerta: "",
      tituloAlerta: "",
      mensagemAlerta: "",
      gerentesAuditados: [],
    };
  },
  methods: {
    mostrarAlerta(cor, icone, titulo, mensagem) {
      this.corAlerta = cor;
      this.iconeAlerta = icone;
      this.tituloAlerta = titulo;
      this.mensagemAlerta = mensagem;
      this.dialogShown = true;
      this.isActive = false;

      setTimeout(() => {
        this.dialogShown = false;
      }, "7000");
      return;
    },
  },
};
</script>

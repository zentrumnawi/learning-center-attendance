<template>
  <v-app>
    <v-toolbar app dark color="primary darken-1">
      <v-toolbar-title class="headline text-uppercase"
        >Anwesenheitsformular</v-toolbar-title
      >
      <v-spacer></v-spacer>
      <v-img
        aspect-ratio="1.5"
        contain
        max-height="100px"
        max-width="80px"
        src="/Goethe-Kopf-weiss.svg"
      ></v-img>
    </v-toolbar>
    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
    <v-footer app dark color="primary darken-1">
      <v-layout text-left ml-4>
        <v-col xs12>
          &copy; 2019&nbsp;&nbsp;|&nbsp;&nbsp;
          <router-link to="/admin">
            <img
              height="20px"
              src="/Icon_ZentrumNaturwissenschaften.svg"
            /> </router-link
          >&nbsp;&nbsp;
          <strong>Zentrum Naturwissenschaften</strong>
        </v-col>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "app",
};
</script>

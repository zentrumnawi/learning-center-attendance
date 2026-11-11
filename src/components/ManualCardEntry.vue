<template>
  <v-container class="manual-entry" max-width="720">
    <v-card>
      <v-card-title class="text-h5">Manuelle Card-ID</v-card-title>
      <v-card-subtitle>
        Card-ID eingeben, falls keine Karte dabei ist.
      </v-card-subtitle>

      <v-card-text>
        <v-text-field
          v-model="manualCardId"
          label="Card-ID"
          variant="outlined"
          hide-details="auto"
          autofocus
          :disabled="lookingUp"
          @keyup.enter="submit"
        ></v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-btn
          color="primary"
          variant="flat"
          :loading="lookingUp"
          :disabled="!manualCardId.trim() || lookingUp"
          @click="submit"
        >
          Weiter zur Anmeldung
        </v-btn>
        <v-btn variant="text" to="/kiosk" :disabled="lookingUp">
          Zurück zum Kiosk
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useRfidStore } from "@/stores/rfid";
import { getAttendeeByCardId } from "@/api/attendees";

const router = useRouter();
const rfidStore = useRfidStore();
const manualCardId = ref("");
const lookingUp = ref(false);

async function submit() {
  const cardId = manualCardId.value.trim();
  if (!cardId || lookingUp.value) return;

  rfidStore.setCardId(cardId);
  rfidStore.clearParticipant();
  lookingUp.value = true;

  try {
    const participant = await getAttendeeByCardId(cardId);
    if (participant) {
      rfidStore.setParticipant(participant);
    }
  } catch (err) {
    console.warn("Participant lookup failed:", err);
  } finally {
    lookingUp.value = false;
  }

  router.push({ name: "Form" });
}
</script>

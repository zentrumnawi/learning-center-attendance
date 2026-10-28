<template>
  <v-container class="kiosk" max-width="720">
    <v-card>
      <v-card-title class="text-h5">RFID-Kiosk</v-card-title>
      <v-card-subtitle>
        Karte an den Leser halten, um die Card-ID zu erfassen.
      </v-card-subtitle>

      <v-card-text>
        <v-alert type="info" variant="tonal" class="mb-4">
          Der Leser arbeitet im Tastatur-Modus. Diese Seite muss Fokus haben —
          einfach die Karte an Reader halten, eine Verbindung ist nicht nötig.
        </v-alert>

        <div class="d-flex align-center ga-3 mb-6">
          <v-chip
            :color="listening ? 'success' : 'default'"
            variant="tonal"
            label
          >
            {{ listening ? "Bereit zum Scannen" : "Inaktiv" }}
          </v-chip>
        </div>

        <!-- Keeps focus for input; visually hidden -->
        <input
          ref="captureInput"
          class="rfid-capture"
          data-rfid-capture="true"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          aria-label="RFID-Eingabe"
          @blur="refocusCapture"
        />

        <div class="card-id-panel" @click="focusCapture">
          <div class="text-subtitle-2 text-medium-emphasis mb-2">Card-ID</div>
          <div class="card-id-value" :class="{ empty: !displayId }">
            {{ displayId || "Warte auf Karte…" }}
          </div>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-btn
          color="primary"
          variant="flat"
          :loading="lookingUp"
          :disabled="!displayId || lookingUp"
          @click="goToForm"
        >
          Weiter zur Anmeldung
        </v-btn>
        <v-btn
          variant="text"
          :disabled="!displayId || lookingUp"
          @click="clearScan"
        >
          Zurücksetzen
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn variant="text" to="/manual-card" :disabled="lookingUp">
          Keine Karte dabei?
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useRfidKeyboard } from "@/composables/useRfidKeyboard";
import { useRfidStore } from "@/stores/rfid";
import { getAttendeeByCardId } from "@/api/attendees";

const router = useRouter();
const rfidStore = useRfidStore();
const captureInput = ref(null);
const lookingUp = ref(false);

const { listening, lastCardId } = useRfidKeyboard({
  onScan(uid) {
    rfidStore.setCardId(uid);
    rfidStore.clearParticipant();
  },
});

const displayId = computed(() => lastCardId.value || rfidStore.cardId);

watch(lastCardId, (uid) => {
  if (uid) {
    rfidStore.setCardId(uid);
    rfidStore.clearParticipant();
  }
});

function focusCapture() {
  captureInput.value?.focus();
}

function refocusCapture() {
  // Stay ready for the next scan while this page is open
  nextTick(() => {
    if (document.visibilityState === "visible") {
      captureInput.value?.focus();
    }
  });
}

onMounted(() => {
  focusCapture();
});

function clearScan() {
  lastCardId.value = null;
  rfidStore.clearCardId();
  rfidStore.clearParticipant();
  focusCapture();
}

async function goToForm() {
  if (!displayId.value || lookingUp.value) return;

  const cardId = displayId.value;
  rfidStore.setCardId(cardId);
  rfidStore.clearParticipant();
  lookingUp.value = true;

  try {
    const participant = await getAttendeeByCardId(cardId);
    if (participant) {
      rfidStore.setParticipant(participant);
    }
  } catch (err) {
    // No existing participant; continue with empty form.
    console.warn("Participant lookup failed:", err);
  } finally {
    lookingUp.value = false;
  }

  router.push({ name: "Form" });
}
</script>

<style scoped>
.kiosk {
  margin-top: 2rem;
}

.rfid-capture {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
  opacity: 0;
}

.card-id-panel {
  padding: 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.02);
  text-align: center;
  cursor: text;
}

.card-id-value {
  font-size: 2rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  word-break: break-all;
}

.card-id-value.empty {
  font-size: 1.25rem;
  font-weight: 400;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.45);
}
</style>

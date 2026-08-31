<template>
  <v-stepper v-model="stepper" :items="steps" item-title="label" hideActions>
    
    
    <template v-slot:item.1>
        <v-form ref="form_studinfo" v-model="valid">
          <v-card>
            <v-card-text>
              <v-text-field
                v-model="form.pid"
                :rules="rules.pid"
                maxlength="8"
                label="ID"
                append-icon="help"
                persistent-hint
                placeholder="XX999999"
                required
                @click:append="idhelper = true"
              ></v-text-field>

              <v-select
                v-model="form.semester"
                :rules="rules.time"
                :items="semester"
                label="Fachsemester"
                required
              ></v-select>

              <v-select
                v-model="form.faculty"
                :items="this.$options.config.faculties"
                :rules="rules.faculty"
                label="Studiengang"
                required
              ></v-select>
            </v-card-text>

            <v-card-actions>
              <v-btn color="primary" @click="next" :disabled="!valid">Weiter</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
        
        <v-dialog v-model="idhelper"  max-width="600">
            <v-card>
              <v-card-title class="headline">ID</v-card-title>
              <v-card-text>
                <p>Die ID setzt sich zusammen aus...</p> 
                <ul>
                  <li>den ersten 2 Buchstaben des Vornamens Ihrer Mutter.</li>
                  <li>den 2 Ziffern des Geburts<em>tags</em> Ihrer Mutter.</li>
                  <li>2 Ziffern Ihres eigenen Geburts<em>monats</em>.</li>
                  <li>2 Ziffern der Nummer Ihres Fachbereichs.</li>
                </ul>
              </v-card-text>
            </v-card>
          </v-dialog>
      </template>

      <template v-slot:item.2>
        <v-form ref="form_coursemath" v-model="valid2">
          <v-card>
            <v-card-title class="justify-center">
              <h2>Mathematik</h2>
            </v-card-title>

            <v-card-text>
              <v-select
                v-model="form.courses"
                :items="this.$options.config.courses_math"
                :rules="rules.course"
                chips closable-chips
                label="Zu welchen Lehrveranstaltungen haben Sie heute gearbeitet?"
                item-title="name"
                item-value="tag"
                multiple
              >
                
                <template v-slot:item="{ item, props }">
                <v-list-item v-bind="props">
                  <template v-if="typeof item.raw !== 'object'">
                    {{ item.raw }}
                  </template>
                  <template v-else>
                    <v-list-item-title v-html="item.raw.name"></v-list-item-title>
                    <v-list-item-subtitle v-html="item.raw.group"></v-list-item-subtitle>
                  </template>
                </v-list-item>
              </template>
              </v-select>
            </v-card-text>

            <v-card-title class="justify-center">
              <h2>Physik</h2>
            </v-card-title>

            <v-card-text>
              <v-select
                v-model="form.courses"
                :items="this.$options.config.courses_physics"
                :rules="rules.course"
                chips closable-chips
                label="Zu welchen Lehrveranstaltungen haben Sie heute gearbeitet?"
                item-title="name"
                item-value="tag"
                multiple
              >

                <template v-slot:item="{ item, props }">
                  <v-list-item v-bind="props">
                  <template v-if="typeof item !== 'object'">
                    <v-list-item v-text="item"></v-list-item>
                  </template>
                  <template v-else>
                    <v-list-item>
                      <v-list-item-title v-html="item.raw.name"></v-list-item-title>
                      <v-list-item-subtitle v-html="item.raw.group"></v-list-item-subtitle>
                    </v-list-item>
                  </template>
                </v-list-item>
                </template>
              </v-select>
            </v-card-text>

            <v-card-actions>
              <v-btn color="primary" @click="next" :disabled="!valid2">Weiter</v-btn>
              <v-btn flat @click.native="previous">Zurück</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </template>

      <template v-slot:item.3>
        <v-card>
          <v-card-text>
            <time-input v-model="form.start" :max="maxStartTime" label="Startzeit" required></time-input>
            <time-input v-model="form.end" label="Jetzt" disabled></time-input>
            <v-textarea
              v-model="form.comments"
              label="Kommentarfeld"
              no-resize
            ></v-textarea>
          </v-card-text>


          <v-card-actions>
            <v-dialog v-model="dialog" persistent max-width="500">
              <template v-slot:activator="{ props }">
                <v-btn color="primary" v-bind="props">Absenden</v-btn>
              </template>

              <v-card>
                <v-card-title class="headline" primary-title>Angaben bestätigen</v-card-title>
               
                <v-list>
                  <v-list-item>
                      <v-list-item-subtitle>ID</v-list-item-subtitle>
                      <v-list-item-title>{{form.pid}}</v-list-item-title>
                      
                    
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item>
                    <v-list-item-subtitle>Studienfach</v-list-item-subtitle>
                    <v-list-item-title>{{form.faculty}}</v-list-item-title>
                    
                  </v-list-item>
                 
                  <v-list-item>
                    <v-list-item-subtitle>Fachsemester</v-list-item-subtitle>
                    <v-list-item-title>{{form.semester}}</v-list-item-title>
                  </v-list-item>

                  <v-divider></v-divider>

                  <v-list-item>
                    <v-list-item-subtitle>Startzeit</v-list-item-subtitle>
                    <v-list-item-title>{{formatTime(form.start)}}</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-subtitle>Endzeit</v-list-item-subtitle>
                    <v-list-item-title>{{formatTime(form.end)}}</v-list-item-title>
                  </v-list-item>

                  <v-divider></v-divider>

                  <v-list-item>
                    <v-list-item-subtitle>Lehrveranstaltungen</v-list-item-subtitle>
                    <v-list-item-title>{{formatCourselist(form.courses)}}</v-list-item-title>
                  </v-list-item>
                </v-list>

                <v-card-text>Sind die Angaben korrekt?</v-card-text>

                <v-card-actions>
                  <v-btn class="primary" @click="submit">Ja</v-btn>
                  <v-btn @click="dialog = false" flat>Nein</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-btn flat @click.native="stepper -= 1">Zurück</v-btn>
          </v-card-actions>
        </v-card>
      </template>
  </v-stepper>
</template>

<script>
import { format, subHours, subMinutes, setMinutes, setHours, isBefore } from "date-fns";
import { mapActions } from "pinia";
import TimeInput from "@/components/TimeInput.vue";
import configuration from '../assets/courses_ws.json'
import { useAttendeesStore } from "@/stores/attendees";

function initializeForm() {
  return {
    pid: "",
    start: isBefore(setHours(new Date(),8), subHours(new Date(),2)) ? subHours(new Date(),2) : (setHours(setMinutes(new Date(),0),8)),
    end: new Date(),
    faculty: null,
    semester: "",
    courses: [],
    comments: ""
  };
}
export default {
  config: configuration,
  components: { TimeInput },
  data: function() {
    return {
      stepper: 0,
      steps: [
        {
          label: "Persönliche ID",
          completed: false
        },
        {
          label: "Lehrveranstaltungen",
          completed: false
        },
        {
          label: "Zeitangabe",
          completed: false
        }
      ],
      interval: null,
      form: initializeForm(),
      courses_selected: [],
      semester: ["1", "2", "3", "4", "5", "6", "7+"],
      dialog: false,
      idhelper: false,
      valid: true,
      valid2: true,
      disabled: 0,
      rules: {
        pid: [
          v => !!v || "Bitte geben Sie Ihre persönlichen 8 stellige ID an",
          v => v.length === 8 || "Ihre ID muss 8 Zeichen lang sein"
        ],
        time: [v => !!v || "Bitte geben Sie Ihre Anwesenheitszeit an"],
        course: [
          v => v.length > 0 || "Bitte wählen Sie mindestens eine Lehrveranstaltung aus"
        ],
        semester: [v => !!v || "Bitte geben Sie Ihr aktuelles Fachsemester an"],
        faculty: [v => !!v || "Bitte geben Sie Ihren Studiengang an"]
      }
    };
  },
  created() {
    // Create an interval to update current time every 1000ms
    this.interval = setInterval(() => this.setEndTime(), 1000);
  },
  unmounted() {
    // Cleanup interval when we leave the page.
    clearInterval(this.interval);
  },
  computed: {
    maxStartTime() {
      return format(subMinutes(this.form.end, 10), "HH:mm");
    },
    localizedForm() {
      return {
        ...this.form,
        start: this.form.start.toString(),
        end: this.form.end.toString()
      };
    }
  },
  methods: {
    ...mapActions(useAttendeesStore, ["saveAttendee"]),
    setEndTime() {
      this.form.end = new Date();
    },
    formatTime(time) {
      return format(time, "HH:mm")
    },
    formatCourselist(courselist) {
      return courselist.join(", ")
    },
    validate() {
      if (this.stepper == 2) {
        this.$refs.form_coursemath.validate();

        if (this.valid2 && this.form.courses.length > 0) {
          this.$refs.form_coursemath.resetValidation();
          return true;
        }
      }

      if (this.stepper == 1) {
        this.$refs.form_studinfo.validate();

        if (this.valid) {
          this.$refs.form_studinfo.resetValidation();
          return true;
        }
      }

      return false;
    },
    next() {
      this.validate()

      this.stepper += 1;
    },
    previous() {
      this.stepper -= 1;
      this.$refs.form_coursemath.resetValidation();
    },
    submit() {
      this.saveAttendee(this.localizedForm);
      this.form = initializeForm();
      this.$refs.form_studinfo.resetValidation();
      this.$refs.form_coursemath.resetValidation();
      this.dialog = false;
      this.valid = false;
      this.stepper = 1;
    }
  }
};
</script>

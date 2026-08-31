<template>
  <v-layout v-if="!authenticated">
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-card-title primary-title class="justify-center">
          <h2>Authentifizierung</h2>
        </v-card-title>
          <v-card-text>
            <p>Bitte geben Sie das Passwort ein.</p>
          <v-text-field
            autofocus v-model="password"
            :append-icon="show_pw ? 'visibility' : 'visibility_off'"
            :type="show_pw ? 'text' : 'password'"
            label="Password"
            @keyup.enter="authenticate"
            @click:append="show_pw = !show_pw"
            >
          </v-text-field>

          </v-card-text>

          <v-card-actions class="justify-center">
            <v-spacer></v-spacer>
            <v-btn class="error" @click="authenticate">Absenden</v-btn>
          </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>

  

  <div v-else id="FormData">
    
    <v-dialog v-model="clearconfirm"  max-width="600">
      <v-card>
        <v-card-title class="headline">Liste löschen?</v-card-title>
        <v-card-text>
          Alle geloggten Zeiten und Studierenden werden gelöscht!
        </v-card-text>
        <v-btn class="warning" @click="clearlist">
          Clear
        </v-btn>
        <v-btn class="primary" @click="clearconfirm = false">
          Abbrechen
        </v-btn>
      </v-card>
    </v-dialog>
    
    <v-tabs>
      <v-tab ripple>Teilnehmerliste</v-tab>
      <v-tab ripple>LV Mathe</v-tab>
      <v-tab ripple>LV Physik</v-tab>
      <v-tab ripple>Studienfächer</v-tab>
      <!--v-tab ripple>Einstellungen</v-tab-->

      <v-spacer></v-spacer>
      <v-btn class="secondary" to="/">
        Logout
      </v-btn>

      <v-tab-item>
        <v-card>
          <v-data-table
            :headers="tbl_headers"
            :items="attendeesTable"
            no-data-text="Keine Daten vorhanden"
            disable-initial-sort
            class="elevation-1"
          >
            <template v-slot:items="props">
              <td class="text-xs-left">{{ props.item.date }}</td>
              <td class="text-xs-left">{{ props.item.pid }}</td>
              <td class="text-xs-left">{{ props.item.start }}</td>
              <td class="text-xs-left">{{ props.item.end }}</td>
              <td class="text-xs-left">{{ props.item.presence }}</td>
              <td class="text-xs-left">{{ props.item.faculty }}</td>
              <td class="text-xs-left">{{ props.item.semester }}</td>
              <td class="text-xs-left">{{ props.item.courses }}</td>
              <td class="text-xs-left">{{ props.item.comments }}</td>
            </template>
          </v-data-table>
          
          <v-card-actions>
            <v-btn class="success" :download="downloadName" :href="downloadURL" :disabled="attendees.length === 0">
              Download
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn class="warning" @click="clearconfirm = true" :disabled="attendees.length === 0">
              Clear
            </v-btn>
            <!--v-btn class="primary" @click="dummydata">
              Populate DB
            </v-btn-->
          </v-card-actions>
        </v-card>
      </v-tab-item>

      <v-tab-item>
        <v-card>
          <v-data-table
            :items="$options.config.courses_math"
            :headers="course_headers"
            class="elevation-1"
            hide-actions
          >
            <template v-slot:items="courses">
              <td class="text-xs-left">{{ courses.item.name }}</td>
              <td class="text-xs-left">{{ courses.item.tag }}</td>
              <td class="text-xs-left">{{ courses.item.semester }}</td>
            </template>
          </v-data-table>

        </v-card>
      </v-tab-item>

      <v-tab-item>
        <v-card>
          <v-data-table
            :items="$options.config.courses_physics"
            :headers="course_headers"
            class="elevation-1"
            hide-actions
          >
            <template v-slot:items="courses">
              <td class="text-xs-left">{{ courses.item.name }}</td>
              <td class="text-xs-left">{{ courses.item.tag }}</td>
              <td class="text-xs-left">{{ courses.item.semester }}</td>
            </template>
          </v-data-table>
        </v-card>
      </v-tab-item>

      <v-tab-item>
        <v-card>
           <v-data-table
            :items="$options.config.faculties"
            :headers="faculty_headers"
            class="elevation-1"
            hide-actions
          >
            <template v-slot:items="faculties">
              <td class="text-xs-left">{{ faculties.item }}</td>
            </template>
          </v-data-table>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import { Parser } from "@json2csv/plainjs";
import { format, addMinutes, differenceInMinutes } from "date-fns";
import { mapActions, mapState } from "pinia";
import configuration from "../assets/courses_ws.json";
import { useAttendeesStore } from "@/stores/attendees";

export default {
  config: configuration,
  data: function() {
    return {
      authenticated: false,
      clearconfirm: false,
      password: null,
      show_pw: false,
      requiredPassword: "HelloWorld",
      attendeesTable: [],
      tbl_headers: [
        {
          text: "Datum",
          align: "left",
          sortable: true,
          value: "date"
        },
        {
          text: "ID",
          align: "left",
          sortable: true,
          value: "pid"
        },
        { text: "Startzeit", value: "start" },
        { text: "Endzeit", value: "end" },
        { text: "Anwesend", value: "presence" },
        { text: "Studiengang", value: "faculty" },
        { text: "Semester", value: "semester" },
        { text: "Lehrveranstaltungen", value: "courses" },
        { text: "Kommentar", value: "comments" }
      ],
      course_headers: [
        {text: "Lehrveranstaltung", value: "name"},
        {text: "Kürzel", value: "tag"},
        {text: "Semester", value: "semester"},
      ],
      faculty_headers: [     
        {text: "Studienfach", value: "name"},
      ],
      crs_headers: [],
      csv_flds: [],

    };
  },
  props: {
    downloadName: {
      default: format(Date.now(), 'yyMMdd_HHmm') + '_mz.csv'
    },
    delimiter: {
      default: ";"
    },
    quote: {
      default: ''
    }
  },
  methods: {
    ...mapActions(useAttendeesStore, ["clearAttendees", "populatedb"]),
    authenticate() {
        if (this.password != this.requiredPassword) return;
        this.authenticated = true;
    },
    select(course) {
      this.faculties_act.push(course);
    },
    clearlist() {     
      this.clearAttendees();
      this.clearconfirm = false;
    },
    dummydata() {
      this.populatedb();
    },
    format(Attendee) {
      Attendee.map(element => ({ ...element, ...this.formatDates(element) }));  
    },
    formatDates(element) {
      const differenceMinutes = differenceInMinutes(element.end, element.start);
      const differenceDate = addMinutes(new Date(0), differenceMinutes);

      return {
        presence: format(differenceDate,'HH:mm'),
        date: format(element.start, 'dd.MM.yyyy'),
        start: format(element.start,'HH:mm'),
        end: format(element.end,'HH:mm'),
        courses: element.courses.join(', ')
      };
    },
      buildheader(courses) {
      return courses.map(course => ({label: course.tag, value: course.tag}))
    },
    
  },
  watch: {
    "attendees": function(newValue) {
      if (newValue === undefined) {
        this.attendeesTable = [];
      }
      //this.attendeesTable = this.format(newValue) //Why doesn't this work?
      this.attendeesTable = newValue.map(element => ({ ...element, ...this.formatDates(element) }));
    }
  },
  created() {

    //set passeword to .env
    this.requiredPassword = import.meta.env.VITE_ADMIN_PASSWORD

    //this.attendeesTable = this.format(this.attendees) //Why doesn't this work?
    this.attendeesTable = this.attendees.map(element => ({ ...element, ...this.formatDates(element) }))

    //build courseheaders
    this.crs_headers = [...this.buildheader([...this.$options.config.courses_math, ...this.$options.config.courses_physics])]

    //build 'fields'-Array from header object for CSV-Parser
    this.csv_flds = this.tbl_headers.map(item => ({label: item.text, value: item.value}))
    
    //remove 'courses' from fields array
    this.csv_flds.splice(this.csv_flds.findIndex(item => item.value == "courses"),1)
    
    //append courseheaders
    this.csv_flds = [...this.csv_flds, ...this.crs_headers]

  },
  computed: {
    ...mapState(useAttendeesStore, ["attendees", "faculties_act"]),
    export() {

      this.attendees.forEach(attendee => {

        this.crs_headers.forEach(course => {
          attendee[course.value] = attendee.courses.findIndex(element => element === course.value ) >= 0 ? 1 : 0

        });
       
      });
      return this.attendees.map(element => ({ ...element, ...this.formatDates(element) }))

    },
    csv() {
      const opts = {fields: this.csv_flds, delimiter: this.delimiter, quote: this.quote, withBOM: true}
      const csv = Parser.parse(this.export, opts)
      return csv
    },  
    downloadURL() {
      return this.attendees.length > 0
        ? "data:text/csv," + encodeURIComponent(this.csv)
        : "javascript:void(0);";
    }
  },
  
};

</script>
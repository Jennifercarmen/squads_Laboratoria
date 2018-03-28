



window.addEventListener('load', function () {

  var elem = document.querySelector('select');
  var instance = M.FormSelect.init(elem, options);
  $('select').formSelect();
  $(".dropdown-trigger").dropdown();
  const dbRefObject = firebase.database().ref('Alumnas');

  organizar();

  function organizar() {
    // sincronizar cambios
    dbRefObject.on('value', function (snap) {
      console.log(snap.val());
    });
  }
  const numberSprint = $("#sprints").val();
  const dataTraining = () => {
    firebase.auth().onAuthStateChanged(function (user) {
      const uiduser = user.uid;

      firebase.database().ref('/TrainingManager/' + uiduser).on('value', snap => {
        const sede = snap.val().sede;
        firebase.database().ref('/users/' + uiduser).on('value', snap => {
          const nameTraining = snap.val().name;
          $('#data').append(`<div>${sede}-${nameTraining}</div>`);
        });
      });
    });
  };
  const fechaActual = () => {
    var f = new Date();
    $('#date').append(`${f.getDate()}/${f.getMonth() + 1}/${f.getFullYear()}</div>`);
  };
  const getSprintActual = (numberSprint) => {
    firebase.database().ref('/sprint/' + numberSprint).on('value', snapshot => {
      const estado = snapshot.val().estado;
      console.log(estado);
      if (estado == 1) {
        organizar();
      }
      else {
        getSquads();
      }
    });
  };

  $("#sprints").change(function () {
    nsprint = $('select[id=sprints]').val();
   
    $('#sprints').val($(this).val());
    $('#btn-reorganizar').attr("disabled", true);
    $('#btns').attr("disabled", true);    
    console.log(nsprint)
    $('#sq1').empty();
    $('#sq2').empty();
    $('#sq3').empty();
    $('#sq4').empty();
    $('#sq5').empty();
    getSquads(nsprint);

  });

  const getSquads = (nsprint) => {
    if (nsprint=="sprint_4"){
      $('#btns').attr("disabled", false);    
      $('#btn-reorganizar').attr("disabled", false);
    }
    firebase.database().ref('/Squads/' + nsprint).on('child_added', snapshot => {
      const idJedi = snapshot.val().jedi;
      firebase.database().ref('/Jedi/' + idJedi).on('value', snap => {
        const Jediy = snap.val().idjedi;
        const jedi = snap.val().name;
        console.log(Jediy);
        $('#sq' + Jediy).append(`<div>
      <p>Squad: 
      ${snapshot.val().name}</p>
      <p>Jedi:${jedi}
       </p>
       <div id='jedi${snapshot.val().id}'>
       </div>
       <br/>
      </div>
      `);
        if (idJedi == "Jedi004") {
          getStudentsforSprint(0);
          getStudentsforSprint(1);
          getStudentsforSprint(2);
          getStudentsforSprint(3);
          getStudentsforSprint(4);
        }
      });
    });
  };
  const getStudentsforSprint = (numbersquad) => {
    firebase.database().ref('/Alumnas/').on('child_added', snapshot => {

      const nsquad = snapshot.val().squads.sprint_1;

      if (nsquad == numbersquad) {
        $(`#jedi${numbersquad}`).append(`<div>
        ${snapshot.val().name.first} ${snapshot.val().name.last}
       
        </div>
        `);

      }
    });
  }

  // Llamado de funciones
  dataTraining();
  fechaActual();
  getSprintActual();
  $('#signOutBtna').click(function () {
    firebase.auth().signOut().then(function () {
      window.location.href = 'login.html';
    }).catch(function (error) {
      alert(error.message);
    });
  });
});



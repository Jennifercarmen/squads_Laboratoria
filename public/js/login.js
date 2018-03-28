window.addEventListener('load', function () {
  function saveUser(user) {
    let userInfo = {
      uid: user.uid,
      name: "No definido",
      email: user.email,
      foto: ""
    }
    firebase.database().ref("users/" + user.uid).set(userInfo);

    firebase.database().ref('TrainingManager/' + user.uid).set({
      sede: "Lima",
    });
    window.location.href = 'views/main.html';
  }


  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {

      saveUser(user);
      console.log("estas logueado");

      var dialog = document.querySelector('#loginDialog');
      if (!dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
      }
      dialog.close();

    } else {
      // No user is signed in.
      console.log("no estas logueado");
      var dialog = document.querySelector('#loginDialog');
      if (!dialog.showModal) {

        dialogPolyfill.registerDialog(dialog);
      }
      dialog.showModal();
    }
  });
  /*LOGIN PROCESS*/
  $('#loginBtn').click(
    function () {
      var email = $('.loginEmail').val();
      var password = $('.loginPassword').val();

      if (email != "" && password != "") {
        //$('#loginProgress').show();
        $('#loginBtn').hide();
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
          M.toast({ html: error.message, classes: 'rounded' })
          //$('#loginError').show().text(error.message);
          //$('#loginProgress').hide();
          $('#loginBtn').show();
        })
      }
    }
  );
  /*LOGOUT PRECESS*/
  $('#signOutBtna').click(function () {
    firebase.auth().signOut().then(function () {
    }).catch(function (error) {
      alert(error.message);
    });
  })
  
});
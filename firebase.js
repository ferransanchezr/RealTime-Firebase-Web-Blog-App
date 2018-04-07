var app_fireBase = {};
(function(){
  var config = {
    apiKey: "....Your keys here....",
    authDomain: "....Your keys here....",
    databaseURL: "....Your keys here....",
    projectId: "....Your keys here....",
    storageBucket: "....Your keys here....",
    messagingSenderId: "....Your keys here...."
  };
  firebase.initializeApp(config);
  app_fireBase = firebase;
})()
var quill = new Quill('#editor', {
    theme: 'snow'
  });
var btn;
var keys;
var ourKey;

function sendBlog(){//düzenleme modu için ekleme yap
  var index;
  var delta = quill.getText();
  var database = firebase.database();
  var ref = database.ref('allBlogDatas');
  index = document.getElementById('mainCat').value;
        subCategoryContent: delta,
        subCategoryName : document.getElementById('subCatName').value,
        subCategoryTitle : document.getElementById('subCatTitle').value
  }
  console.log(content);
  ref.child(index).child("subCategoryList").push(content);
  setTimeout(function() {
    window.alert("İşlem yapıldı...");
  }, 1000);
  clearAreas();
}

function updateBlog() {
  var ref = firebase.database().ref('allBlogDatas');
  var index = document.getElementById('setMainCat').value;
  var content ={
    subCategoryContent: quill.getText(),
    subCategoryName : document.getElementById('subCatName').value,
    subCategoryTitle : document.getElementById('subCatTitle').value
  }
  var data = ref.child(index).child("subCategoryList").child(ourKey);
  data.update(content);
  setTimeout(function() {
    window.alert("İşlem yapıldı...");
  }, 1000);
  clearAreas();
}

function deleteBlog(){
  var index = document.getElementById('setMainCat').value;
  var data = firebase.database().ref('allBlogDatas').child(index).child("subCategoryList").child(ourKey);
  data.remove();
  setTimeout(function() {
    window.alert("İşlem yapıldı...");
  }, 1000);
  clearAreas();
}

function gotForSet(data){
  var data = data.val();
  document.getElementById('subCatName').value = data[ourKey].subCategoryName;
  document.getElementById('subCatTitle').value = data[ourKey].subCategoryTitle;
  //document.getElementById('editor').innerHTML = data[ourKey].subCategoryContent;
  quill.setText(data[ourKey].subCategoryContent);
}

function clearAreas(){
  quill.setText('');
  document.getElementById('subCatName').value = '';
  document.getElementById('subCatTitle').value ='' ;
}

function fillArea(){
  var ref = firebase.database().ref('allBlogDatas');
  var index = document.getElementById('setMainCat').value;
  var subName= document.getElementById('setSubCat').selectedIndex;
  ourKey = keys[subName];
  var data = ref.child(index).child("subCategoryList");
  data.on('value', gotForSet);
}

function setMode(){
    btn = document.getElementById('setBtn');
    if (btn.value == "Ekleme Modu") {
      btn.value= "Düzenleme Modu";
      document.getElementById('setTool').style.display="none";
      document.getElementById('addTool').style.display="block";
      document.getElementById('sendBtn').style.display="block";
      document.getElementById('updateBtn').style.display="none";
      document.getElementById('deleteBtn').style.display="none";
      clearAreas();
    }else {
      btn.value = "Ekleme Modu";
      document.getElementById('setTool').style.display="block";
      document.getElementById('addTool').style.display="none";
      document.getElementById('sendBtn').style.display="none";
      document.getElementById('updateBtn').style.display="block";
      document.getElementById('deleteBtn').style.display="block";
      clearAreas();
    }
}

function listNames(){
  var database = firebase.database();
  var ref = database.ref('allBlogDatas');
  var index = document.getElementById('setMainCat').value;

  var subData = ref.child(index).child('subCategoryList');//bir adım daha gidebilirsin
  subData.on('value', gotData, errData);
}
function gotData(data){
  var list = document.getElementById('setSubCat');
  list.options.length=0;
  var data = data.val();
  setOption(data, list);
}

function setOption(data , list){
  var k, option;
  keys = Object.keys(data);
  for (var i = 0; i < keys.length; i++) {
    k = keys[i]
    option = document.createElement("option");
    option.text = data[k].subCategoryName;
    list.add(option, null);
  }
}

function errData(err){
  console.log(err);
  console.log('err');
}

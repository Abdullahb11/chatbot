import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getFirestore ,collection,addDoc,getDocs,doc,deleteDoc,updateDoc} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB7AKLcTZri9NWgcfXf6PLSnMGZebNSEUU",
  authDomain: "crud-f725c.firebaseapp.com",
  projectId: "crud-f725c",
  storageBucket: "crud-f725c.firebasestorage.app",
  messagingSenderId: "562545986140",
  appId: "1:562545986140:web:148b28b90d21124c81f499",
  measurementId: "G-3WLMPCMXFH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log(app)




const db = getFirestore(app);


fetchTasks();



//working 

//get from ui and sending to database  (C of crud)
 const form = document.getElementById('textForm');
form.addEventListener('submit', function (e) {
  e.preventDefault();
  const value = document.getElementById('userInput').value.trim();

  if (value === '') return;

  addTaskToDatabase(value); // Call the async function
  



  form.reset();
});

async function addTaskToDatabase(taskValue) {
  try {
    const docRef = await addDoc(collection(db, "tasks"), {
      task: taskValue,
      createdAt: new Date()
    });

    console.log("Document written with ID: ", docRef.id);
fetchTasks();

  } catch (e) {
    console.error("Error adding document: ", e);
  }
}











//getting data  (R of crud)


const output = document.getElementById('output');


async function fetchTasks() {
  try {
    const querySnapshot = await getDocs(collection(db, "tasks"));
    output.innerHTML = ""; // Clears old content

    querySnapshot.forEach((doc) => {

      
  const newDiv = document.createElement('div');
  newDiv.className = 'flex items-center justify-between bg-green-100 text-green-800 px-4 py-2 rounded shadow';

  const textSpan = document.createElement('span');
  textSpan.textContent = doc.data().task;

  const btnContainer = document.createElement('div');
  btnContainer.className = 'space-x-2';

  const editBtn = document.createElement('button');
  editBtn.addEventListener("click",()=>editTask(doc.id,doc.data().task))
  editBtn.textContent = 'Edit';
  editBtn.className = 'bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded';

  const deleteBtn = document.createElement('button');
  deleteBtn.addEventListener("click",()=>deleteTask(doc.id));
  deleteBtn.textContent = 'Delete';
  deleteBtn.className = 'bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded';

  btnContainer.appendChild(editBtn);
  btnContainer.appendChild(deleteBtn);

  newDiv.appendChild(textSpan);
  newDiv.appendChild(btnContainer);

  output.appendChild(newDiv);


      console.log(doc.id, "=>", doc.data().task);
    });
  } catch (e) {
    console.error("Error fetching tasks:", e);
  }
}






  // D of crud ( this function has been added to the button in event listen so button will have id of the task and will delte when clicked  )
  async function deleteTask(taskId) {
  try {
    await deleteDoc(doc(db, "tasks", taskId));
    console.log("Deleted task with ID:", taskId);
  } catch (e) {
    console.error("Error deleting task:", e);
  }
  fetchTasks();

}




//U of crud ( to update )

async function editTask(id, oldTask) {
  const newTask = prompt("Edit your task:", oldTask);
  if (newTask && newTask !== oldTask) {
    const taskRef = doc(db, "tasks", id);
    await updateDoc(taskRef, { task: newTask });
  }
  fetchTasks();

}

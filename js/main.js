
function createElemWithText(element = "p", content = "", className) {
  let created_element = document.createElement(element);
  created_element.textContent = content;
  // if class name exists
  if (className) {
    // set the class of the created element
    created_element.className = className;
  }
  // return the created element
  return created_element;
}



function createSelectOptions(user_data){
  if(!user_data){
    return undefined
  }
  let options_arr = []
  for(let i=0; i<user_data.length; i++){
    let option = document.createElement("option");
    
    option.value = user_data[i].id;
    
    option.textContent = user_data[i].name;
    
    options_arr[i] = option;
  }
  return options_arr
}



function toggleCommentSection(postId) {
  if (!postId) {
      return undefined;
  } else {
    // get comment sections
      const commentSections = document.querySelectorAll('section');

      for (let i = 0; i < commentSections.length; i++) {

          const commentSection = commentSections[i];

          const commentId = commentSection.getAttribute('data-post-id')

          if (commentId == postId) {
              commentSection.classList.toggle('hide');
              return commentSection;
          }
      }

      return null;
  }   
}



function toggleCommentButton(post_id) {
  // if no post exist return undefined
  if (!post_id) {
    return undefined;
  }
  // otherwise select the button
  const selected_button = document.querySelector(`button[data-post-id = "${post_id}"`);
  // if button found change it as instructed
  if (selected_button != null) {
    selected_button.textContent === "Show Comments" ? (selected_button.textContent = "Hide Comments") : (selected_button.textContent = "Show Comments");
  }

  return selected_button;
};



function isHTMLElement(element) {
    return element instanceof Element || element instanceof HTMLDocument;  
}

function deleteChildElements(parentElement) {
  if(!parentElement || !isHTMLElement(parentElement)){
    return undefined
  }
  
  let child = parentElement.lastElementChild;
  
  while (child) {
    parentElement.removeChild(child);
    child = parentElement.lastElementChild;
  }
  
  return parentElement
}


function addButtonListeners(){
  // seletc main
  let main_el = document.querySelector('main')
  
  // select buttons
  let buttons = main_el.querySelectorAll('button')
  
  // if buttons exist
  if(buttons){
      for(let i = 0; i < buttons.length; i++){
          let button = buttons[i]
          let postId = button.dataset.postId
          button.addEventListener('click', function(event){
              toggleComments(event, postId), false
          })
      }
      return buttons
  }
  // if no buttons are found
  return undefined
}



function removeButtonListeners(){
  // select main
  let main_el = document.querySelector('main')
  
  // select buttons
  let buttons = main_el.querySelectorAll('button')
  
  // if buttons are found
  if(buttons){
      for(let i = 0; i < buttons.length; i++){
          let button = buttons[i]
          let postId = button.dataset.postId
          button.removeEventListener('click', function(event){ 
          toggleComments(event, postId), false
          buttons[i] = button
      })
      }
      return buttons
  }
  // else if no buttons found
  return undefined
}




function createComments(comments) {
  // if no comments are passed return undefined
  if (!comments) {
    return undefined;
  }
  // create fragment element
  let fragment = document.createDocumentFragment();

  
  for (let i = 0; i < comments.length; i++) {
    // select element
    const comment = comments[i];
    // create elements
    let article = document.createElement("article");
    let h3 = createElemWithText("h3", comment.name);
    let para_1 = createElemWithText("p", comment.body);
    let para_2 = createElemWithText("p", `From: ${comment.email}`);
    
    // append created elements
    article.appendChild(h3);
    article.appendChild(para_1);
    article.appendChild(para_2);
    
    // append article to fragment
    fragment.appendChild(article);
  }
  return fragment;
}



function populateSelectMenu(users) {

  // if no users return undefined
  if (!users){
    return undefined 
  }

  let menu = document.querySelector("#selectMenu");

  let options = createSelectOptions(users);

  for (let i = 0; i < options.length; i++) {
      let option = options[i];
      menu.append(option);
  }

  return menu;
}




async function getUsers() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    const data = await response.json();
    return data;
  } catch(err) {
    console.error(err);
  }
  
}




async function getUserPosts(id) {
  if(!id){
    return undefined
  }
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${id}`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}



async function getUser(id) {
  if(!id){
    return undefined
  }
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}



async function getPostComments(id) {
  if(!id){
    return undefined
  }
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${id}`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}




async function displayComments(postId){

  if(!postId){
    return undefined;
  }
  
  // create section
  let section = document.createElement("section");

  // get post ID
  section.dataset.postId = postId;
  
  // add attributes
  section.classList.add("comments", "hide");

  let comments = await getPostComments(postId);

  let fragment = createComments(comments);

  section.append(fragment)

  return section;
}



async function createPosts(posts) {
  // if posts are not passed
  if(!posts){
    return undefined
  }
  
  // create fragment
  const fragment = document.createDocumentFragment();
  
  // loop over posts
  for (const post of posts) {
      const article = document.createElement('article');
      const h2 = createElemWithText('h2', post.title);
      const p1 = createElemWithText('p', post.body);
      const p2 = createElemWithText('p', `Post ID: ${post.id}`);
      const author = await getUser(post.userId);
      const p3 = createElemWithText('p', `Author: ${author.name} with ${author.company.name}`);
      const p4 = createElemWithText('p', author.company.catchPhrase);
      const button = createElemWithText('button', 'Show Comments');
    
      button.dataset.postId = post.id;
      article.append(h2, p1, p2, p3, p4, button);
    
      const section = await displayComments(post.id);
    
      article.append(section);
    
      fragment.append(article);
  }
  return fragment;
}





async function displayPosts(posts){
  // select main
  let main = document.querySelector("main");
  
  // fetch the post
  let element = (posts) ? await createPosts(posts) : document.querySelector("main p");
  
  main.append(element);
  
  return element;
}




function toggleComments(event, postId){
  // if no nevent or no postId is passed
  if (!event || !postId){
      return undefined;
  }
  
  event.target.listener = true;
  
  let section  = toggleCommentSection(postId);
  let button = toggleCommentButton(postId);
  
  return [section, button];
}


async function refreshPosts(posts){
  // if no posts are passed
  if (!posts){
      return undefined;
  }

  let buttons = removeButtonListeners();
  let myMain = deleteChildElements(document.querySelector("main"));
  let fragment = await displayPosts(posts);
  let button = addButtonListeners();
  
  return [buttons, myMain, fragment, button];
}



async function selectMenuChangeEventHandler(e){
  if(!e){
    return undefined
  }
  // set userId using cheat sheet method
  let userId = e?.target?.value || 1;
  // fetch posts
  let posts = await getUserPosts(userId);
  // refresh posts
  let refreshPostsArray = await refreshPosts(posts);
  
  return [userId, posts, refreshPostsArray];
}


async function initPage(){
  // fetch users
  let users = await getUsers();
  
  // get results of menu select
  let select = populateSelectMenu(users);
  
  return [users, select];
}

function initApp(){
  // call init page
  initPage();
  
  // menu selection
  let select = document.getElementById("selectMenu");
  
  // add event listener to the menu
  select.addEventListener("change", selectMenuChangeEventHandler, false);
}

document.addEventListener("DOMContentLoaded", initApp);
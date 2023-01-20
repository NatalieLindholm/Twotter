import './style.css'
import { supabase } from './supabase.js'

// Auth

// Listen to auth events
supabase.auth.onAuthStateChange((event, session) => {
  const loginEl = document.querySelector("#login")
  const logoutEl = document.querySelector("#logout")
  const newTweetEl = document.querySelector("#newtwoot")

  if (event == 'SIGNED_IN') {
    console.log('SIGNED_IN', session)

    // Hide login
    loginEl.classList.add("hidden")

    // Show logout
    document.querySelector("#logout > h2").innerText = session.user.email
    logoutEl.classList.remove("hidden")

    // Show new twoot
    newTweetEl.classList.remove("hidden")
  }

  if (event == 'SIGNED_OUT') {
    // Show login
    loginEl.classList.remove("hidden")

    // Hide logout
    logoutEl.classList.add("hidden")

    // Hide new Twoot
    newTweetEl.classList.add("hidden")
  }
})


// Sign in/up
const form = document.querySelector("form")

form.addEventListener("submit", async function (event) {
  const email = form[0].value
  const password = form[1].value

  // Stop page from refreshing
  event.preventDefault()

  // Login
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  // If login error
  if (signInError) {
    // If no account, sign up  
    if (signInError.message === "Invalid login credentials") {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      // Create user in database
      if (signUpData.user.id) {
        const { error } = await supabase
          .from('User')
          .insert({ username: signUpData.user.email })

        if (error) console.log(error);
      }

      // If user already registered
      if (signUpError.message === "User already registered") {
        alert(signInError.message)
      } else {
        alert(signUpError.message)
      }
    }
  }
})

// Sign out
const signOutButton = document.querySelector("#logout > button")

signOutButton.addEventListener("click", async function () {
  const { error } = await supabase.auth.signOut()

  if (error) console.log(error)
})

// Twoots

// Listen for changes to database table
supabase
  .channel('public:Twoots')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Twoots' }, newTwoot)
  .subscribe()

let newTwootCount = 0

function newTwoot(e) {
  newTwootCount++

  const newTwootEl = document.querySelector('#new-twoot')

  newTwootEl.innerText = `Show ${newTwootCount} Twoots`
  newTwootEl.classList.remove('hidden')
}

// Refresh feed
document.querySelector('#new-twoot').addEventListener('click', function () {
  document.querySelector("#new-twoot").classList.add("hidden")
  document.querySelector('ul').replaceChildren()
  newTwootCount = 0
  getTwoots()
})



async function getTwoots() {
  // get data from database
  const { data, error } = await supabase
    .from('Twoots')
    .select(`
            id,
            message,
            created_at,
            User(
                username
            )
        `)
    .order('created_at', { ascending: false })

  if (error) {
    console.log(error)
  }

  const listEl = document.querySelector('ul')

  const { data: user } = await supabase.auth.getSession()



  // Loop over twats
  for (const twat of data) {
    console.log(twat);
    const item = document.createElement('li')
    item.classList.add('flex', 'gap-4', 'border-b', 'pb-6')

    item.innerHTML =
      `
        <div class="w-14 h-14 rounded-full">
          <img class="rounded-full" src="pfp.png" alt="">
        </div>

        <div>
          <div class="flex gap-2 text-gray-500">
            <span class="font-semibold text-black">${twat.User.username}</span>
            <span>${new Date(twat.created_at).toLocaleString()}</span>
            <i class="ph-trash text-xl ${twat.User.username == user.session.user.email ? '' : 'hidden'}"></i>
            </div>
          <p>${twat.message}</p>
        </div>
      `

    // Delete twoot
    item.addEventListener('click', async function () {
      const { error } = await supabase
        .from('Twoots')
        .delete()
        .eq('id', twat.id)

      // Delete element
      item.remove()

      if (error) console.log(error)
    })

    listEl.appendChild(item)

  }

}

getTwoots()


// New twoot
document.querySelector('#createtwoot').addEventListener('click', async function () {
  const text = document.querySelector('textarea')

  const { data, error } = await supabase.auth.getSession()

  if (error) console.log(error);

  if (data.session.user.id) {
    const { error } = await supabase
      .from('Twoots')
      .insert({ message: text, user_id: data.session.userid })

    if (error) console.log(error);

    // Clear input
    text.value = ''
  }
})
import './style.css'

import { supabase } from './supabase.js'

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

    if (error) {
        console.log(error)
    }

    const listEl = document.querySelector('ul')

    // Loop over twats
    for (const twat of data) {
        console.log(twat);
        const item = document.createElement('li')
        item.classList.add('flex', 'gap-4', 'border-b', 'pb-6')

        item.innerHTML = `
        <div class="w-14 h-14 rounded-full">
          <img src="logo.png" alt="">
        </div>

        <div>

          <div class="flex gap-2 text-gray-500">
            <span class="font-semibold text-black">${twat.name}</span>
            <span>@${twat.username}</span>
            <span>${new Date(twat.created_at).toLocaleString()}</span>
          </div>

          <p>${twat.message}</p>

          <button class="flex items-center gap-2 mt-1  hover:text-red-300">
            <i class="ph-heart text-xl"></i>
            <span class="text-sm">0</span>
          </button>

        </div>
      `

        listEl.appendChild(item)
    }

}

getTwoots()
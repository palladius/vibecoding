It’s always been my dream to create a magic bookmark Chrome Extension which works this way. Every time I'm on a website,
say a youtube page "https://www.youtube.com/watch?v=1vTOG5QFOWY" or a medium article, this extension looks up a DB (say
Google Cloud Firestore, for instance, to keep schema flexible and size low) and if there is some sort of bookmark
(url, title, description) it renders that note. So the app is basically a post it note which gets triggered by me
navigating a certain bookmark, stored by [ url, user_id, title, description, .. and usual timestamp modifiers as in rails].
Initially we make it work just for myself (user_id = 1, email=palladiusbonton@gmail.com) but keep it multi tenant for
the future. I've never written a chromext, can you please help me?


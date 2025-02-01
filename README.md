
###### In Progress...       



<h2 align="center"> Functionality </h2>

__Room:__
- players can either **create** | **join** room
- room-creater will be **playerX**
- second-joiner will be **playerO**
- game supports multiple game-rooms
- each game-room can only supports 2 players
- Others, are forced-out to join other rooms

---

__GameLogic:__
- multiple players can play game parallely in different rooms
- Game-moves are filtered, handled in real-time through websockets
- __Game-Logic__ is handled __server-side__, To prevent-chances of cheating
- **client-side** is only responsible for receiving and **rendering board** and results
- Each game with their own instance resulting in isolated game & no-conflict-of-state


---
---

__TODO__: 
- minor UI improvements [score, better turn-ticker & game-status ... ]
- implement spectator feature



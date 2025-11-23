## Boucles audio CodeQuest

Déposez ici vos boucles d’ambiance (format `.mp3`, `.ogg` ou `.webm`).  
Le moteur charge automatiquement les fichiers suivants pour mixer l’atmosphère quotidienne :

| Météo  | Fichiers attendus                               | Description rapide                                      |
|--------|-------------------------------------------------|---------------------------------------------------------|
| dawn   | `dawn-bed.mp3`, `dawn-birds.mp3`                | Drone léger + oiseaux matinaux                          |
| sunset | `sunset-wind.mp3`, `sunset-insects.mp3`         | Vent doux + chant d’insectes                            |
| storm  | `storm-rain.mp3`, `storm-thunder.mp3`           | Pluie continue + grondements lointains                  |
| night  | `night-crickets.mp3`, `night-wind.mp3`          | Criquets nocturnes + souffle grave                      |
| aurora | `aurora-breeze.mp3`, `aurora-chimes.mp3`        | Brise froide + tintements cristallins                   |
| ember  | `ember-fire.mp3`, `ember-sparks.mp3`            | Brasier crépitant + étincelles                          |

Vous pouvez utiliser vos propres formats/noms : adaptez simplement `src/core/audioScenes.ts`.  
Les boucles doivent être propres (sans clic), idéalement 30-60 s, et exportées en mono pour limiter le poids.  
Pour un crossfade naturel, laissez au moins 500 ms de silence en fin de fichier.

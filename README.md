# andu0870_9103_Major_Project
## *PART1: Instructions for Interacting with the Work*
1. Click the play/pause button at the bottom of the screen to play music. The cars will move with the music, and the lights will change color according to the music.
2. Press the lights with the mouse, and the lights will produce a drum beat sound effect.


## *PART2: My Approach to Animation Implementation*
- I use audio to drive my code by obtaining audio spectrum data through the p5.FFT object. In the draw function, I use fft.analyze() to get the spectrum data and map it to the positions of the cars and the colors of the lights, making the cars move with the music and the lights change color according to the music. Additionally, I use the function mousePressed() to detect mouse press events, enabling the effect of playing a drum sound when the lights are pressed.

## *PART3: Inspiration & Animation Concept*
- My inspiration comes from the popular interpretation of the painting “Broadway Boogie Woogie”. Mondrian cleverly distributes small color blocks along yellow vertical and horizontal lines, breaking the structured framework with a sense of musical rhythm and creating a feeling of jazzy intensity and freedom. The bustling and busy arrangement of the painting makes one feel as if they are on the streets of New York, surrounded by rushing cars. Yet, the rhythm of jazz makes everything on the street seem to come alive, filled with vitality and dynamism.

- Therefore, I turned the painting into a dynamic player effect. I chose a piece of jazz music and conceptualized the color blocks in the center of the painting as cars. When the music starts, the cars move rhythmically with the jazz, and the lights in the painting become a breathing light effect, constantly changing with the rhythm of the music. I set the light colors to transition from yellow to red to express the feeling of autumn. The cars move continuously, and the lights flicker like maple leaves, creating a visually vibrant and dynamic experience.

- Additionally, I added an interactive feature where pressing the lights produces a drum beat sound. Users can add new effects to the jazz music with the drum beats, improving their experience by interacting with the piece and further appreciating the combination of music and visual elements.

- Overall, this is an attempt to combine static art with dynamic audio-visual techniques. Through this approach, I aim to convey the bustling, vibrant, and rhythmic atmosphere of New York City streets, making users feel as if they are immersed in a colorful autumn city full of jazz rhythms.
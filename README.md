# Lab 0

### Book paragraph

##### Chapter 3.1.1 The Rotating Square, Page 100

Consider the two-dimensional point x = cos θ y = sin θ .
This point lies on a unit circle regardless of the value of θ. The three points (− sin θ , cos θ ), (− cos θ , − sin θ ), and (sin θ , − cos θ ) also lie on the unit circle. These four points are equidistant along the circumference of the circle, as shown in Figure 3.1. Thus, if we connect the points to form a polygon, we will have a square centered at the origin whose sides are of length √2. We can start with θ = 0, which gives us the four vertices (0, 1), (1, 0), (−1, 0) and (0, −1). We can send these vertices to the GPU by first setting up an array...

### Tutorial & Improvement
The tutorial I personally used to get to the triangle was the following: https://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html

I do not think that there is much to add upon to this tutorial, other than maybe gif images/visualisations about what each part does. Personally I stumbled upon a nice youtube video, at the start of which the whole process was very nicely visually explained (https://youtu.be/y2UsQB3WSvo?si=rZPtzp97Z6DerQ6q&t=219).
Another point which seemed quite confusing to me is how the whole "transfering data from buffer to shader attribute" works. There is however an article mentioned in the comments about this(https://webglfundamentals.org/webgl/lessons/webgl-how-it-works.html), and I think it is definitely worth a mention in the tutorial itsself.
#define GL_SILENCE_DEPRECATION
#include <GL/glew.h>
#include <GL/glut.h>
#include <GLFW/glfw3.h>
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <OpenGL/OpenGL.h>
#include <math.h>
#include <iostream>

// Define the window size
const int window_width = 800;
const int window_height = 600;
// Camera parameters
GLfloat angle = 0.0f;  // Rotate angle
// Player's position
GLfloat playerPosX = 5.0f;
GLfloat playerPosZ = -0.6f;
GLfloat playerSpeed = 0.1f;  // Speed of movement
bool finishLineVisible = true;
const GLfloat FINISH_LINE_X_MIN = 3.0f;
const GLfloat FINISH_LINE_X_MAX = 8.0f;
const GLfloat FINISH_LINE_Z = 0.0f;
const float centerX = 0.0f;  // Replace with actual center X if different
const float centerZ = 0.0f;  // Replace with actual center Z if different
GLfloat cameraPos[3] = {0.1f, 0.1f, 0.1f}; // Default view position (Front)
float playerRotation = 0.0f;  // Player's rotation (in degrees)
float cameraX = 0.0f, cameraY = 15.0f, cameraZ = 30.0f;  // Camera position
float cameraAngleY = 0.0f;  // Angle for looking left/right
float cameraAngleX = 0.0f;  // Angle for looking up/down
float movementSpeed = 1.0f; // Camera movement speed
int timer = 60;  // Timer countdown from 60 seconds
bool gameWon = false;  // Whether the player has crossed the finish line
bool gameOver = false;  // Whether the game is over
bool gameOverFlag = false; 

// Function to initialize the OpenGL settings
void initOpenGL() {
    glClearColor(0.0, 0.0, 0.0, 1.0);  // Black background
    glEnable(GL_DEPTH_TEST);  // Enable depth testing
    glMatrixMode(GL_PROJECTION);  // Set projection mode
    glLoadIdentity();  // Load identity matrix
    gluPerspective(45.0f, (GLfloat)window_width / (GLfloat)window_height, 0.1f, 100.0f);  // Set perspective
    glMatrixMode(GL_MODELVIEW);  // Switch to model view
    // Set the camera position using gluLookAt
    glLoadIdentity();  // Clear any previous transformations
}
float sunColor[3] = {1.0f, 1.0f, 0.0f};  // Initial color: Yellow
bool colorChangeActive = false;           // Flag to toggle color change
float colorChangeSpeed = 0.01f;          // Speed of the color change
void updateSunColor() {
    if (colorChangeActive) {
        // Change color gradually by modifying RGB values
        sunColor[0] += colorChangeSpeed;  // Increase Red component (can be used for sunset effect)
        sunColor[1] -= colorChangeSpeed;  // Decrease Green component (can be used for sunset effect)
        
        // Ensure color stays within the range [0, 1]
        if (sunColor[0] > 1.0f) sunColor[0] = 1.0f;
        if (sunColor[1] < 0.0f) sunColor[1] = 0.0f;

        // Optionally add more logic for blue component or different color transitions
    }
}
// Function to draw the sun (yellow sphere) at the top-left corner
void drawSun() {
    glPushMatrix();

    // Move the sun to the top-left of the scene
    glTranslatef(-17.0f, 10.0f, -10.0f);  // Adjust as needed

    // Set the sun color to yellow
    glColor3f(sunColor[0], sunColor[1], sunColor[2]);  // Yellow color

    // Draw a solid sphere to represent the sun
    glutSolidSphere(2.0f, 50, 50);  // Radius 2.0, 50 slices, 50 stacks
    // Draw 8 rays
    float rayLength = 4.0f;  // Length of the rays
    for (int i = 0; i < 8; ++i) {
        float angle = i * 45.0f;  // Angle in degrees (45 degrees between each ray)
        float radian = angle * 3.14159f / 180.0f;  // Convert to radians

        // Calculate the end point of the ray
        float x = rayLength * cos(radian);
        float y = rayLength * sin(radian);

        // Set the color for the rays (optional, can be set to a different color)
        glColor3f(sunColor[0], sunColor[1], sunColor[2]);  // Yellow color for rays

        // Draw the ray as a line from the center of the sun to the calculated point
        glBegin(GL_LINES);
            glVertex3f(0.0f, 0.0f, 0.0f);  // Start at the center of the sun
            glVertex3f(x, y, 0.0f);  // End at the calculated point for the ray
        glEnd();
    }

    glPopMatrix();
}
// Function to draw the sky
void drawSky() {
    glPushMatrix();

    // Set the color for the sky (light blue for a daytime sky)
    glColor3f(0.53f, 0.81f, 0.98f);  // Light blue color

    // Draw a large quad that represents the sky
    glBegin(GL_QUADS);

    // Define the four corners of the sky (this covers the entire scene)
    glVertex3f(-50.0f, 50.0f, -50.0f);  // Top-left
    glVertex3f( 50.0f, 50.0f, -50.0f);  // Top-right
    glVertex3f( 50.0f, -50.0f, -50.0f); // Bottom-right
    glVertex3f(-50.0f, -50.0f, -50.0f); // Bottom-left

    glEnd();

    glPopMatrix();
}
void drawSphere(float x, float y, float z, float radius) {
    GLUquadricObj *quadratic = gluNewQuadric();
    gluQuadricNormals(quadratic, GLU_SMOOTH);
    glPushMatrix();
    glTranslatef(x, y, z);  // Position the sphere
    gluSphere(quadratic, radius, 20, 20);  // Draw the sphere
    glPopMatrix();
}
// Global variables for cloud color change animation
float cloudColor[4] = {1.0f, 1.0f, 1.0f, 0.5f};  // Initial color: White with some transparency
bool cloudColorChangeActive = false;              // Flag to toggle cloud color change
float cloudColorChangeSpeed = 0.01f;              // Speed of color change
void updateCloudColor() {
    if (cloudColorChangeActive) {
        // Gradually change the color of the cloud (e.g., transitioning from white to light gray)
        cloudColor[0] -= cloudColorChangeSpeed;  // Reduce Red component
        cloudColor[1] -= cloudColorChangeSpeed;  // Reduce Green component
        cloudColor[2] -= cloudColorChangeSpeed;  // Reduce Blue component
        
        // Ensure color stays within the range [0, 1]
        if (cloudColor[0] < 0.5f) cloudColor[0] = 0.5f;
        if (cloudColor[1] < 0.5f) cloudColor[1] = 0.5f;
        if (cloudColor[2] < 0.5f) cloudColor[2] = 0.5f;

        // Optionally, you can set minimum and maximum thresholds for the color (e.g., transition to gray)
    }
}
void drawCloud() {
    // Set the transparency for the cloud
    glEnable(GL_BLEND);
    glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
    glColor4f(cloudColor[0], cloudColor[1], cloudColor[2], cloudColor[3]);  // White color with some transparency

    // Draw three spheres to represent the cloud in the top-right corner
    drawSphere(10.0f, 8.0f, -15.0f, 2.0f);  // Center sphere
    drawSphere(12.5f, 9.0f, -15.0f, 1.5f);  // Right sphere
    drawSphere(7.5f, 9.0f, -15.0f, 1.5f);   // Left sphere
    drawSphere(5.0f, 8.0f, -15.0f, 2.0f);   // Left sphere




    glDisable(GL_BLEND);
}

// Function to draw the ground (floor)
void drawGround(float centerX, float centerY, float centerZ, float width, float depth) {
    glColor3f(0.3f, 0.7f, 0.3f);  // Greenish color for the ground

    glBegin(GL_QUADS);  // Start drawing a quad

    // Define the four corners of the ground plane
    glVertex3f(centerX - width / 2, centerY, centerZ - depth / 2);  // Bottom left
    glVertex3f(centerX + width / 2, centerY, centerZ - depth / 2);  // Bottom right
    glVertex3f(centerX + width / 2, centerY, centerZ + depth / 2);  // Top right
    glVertex3f(centerX - width / 2, centerY, centerZ + depth / 2);  // Top left

    glEnd();
}
bool treeScaling = false;  // Flag to control scaling state
float scaleFactor = 1.0f;  // Initial scale factor (1.0 means no scaling)

// Function to draw a tree
void drawTree(float x, float y, float z) {
    // Draw the trunk (cylinder)
    glPushMatrix();
    if (treeScaling) {
        scaleFactor += 0.05f;  // Increase the scaling factor to make the tree grow
        if (scaleFactor > 2.0f) scaleFactor = 2.0f;  // Limit the maximum scale
    } else {
        scaleFactor = 1.0f;  // Reset scale to normal size
    }

    // Apply the scaling transformation
    glScalef(scaleFactor, scaleFactor, scaleFactor);

    glTranslatef(x, y, z);  // Position the trunk
    glColor3f(0.55f, 0.27f, 0.07f);  // Brown color for the trunk

    GLUquadricObj *quadratic = gluNewQuadric();
    gluQuadricNormals(quadratic, GLU_SMOOTH);
    gluCylinder(quadratic, 0.3f, 0.3f, 2.5f, 20, 20);  // Trunk size
    glPopMatrix();

    // Draw the leaves (spheres) just above the trunk, closely attached
    glPushMatrix();
    glTranslatef(x, y + 0.5f, z);  // Position the foliage right at the top of the trunk
    glColor3f(0.0f, 0.6f, 0.0f);   // Green color for the leaves

    // Draw compact foliage with spheres clustered around the trunk's top
    drawSphere(0.0f, 0.2f, 0.0f, 0.5f);  // Top center leaves
    drawSphere(0.3f, 0.1f, 0.3f, 0.4f);  // Right-side leaves
    drawSphere(-0.3f, 0.1f, 0.3f, 0.4f); // Left-side leaves
    drawSphere(0.0f, 0.1f, -0.3f, 0.4f); // Back leaves
    drawSphere(0.0f, 0.1f, 0.3f, 0.4f);  // Front leaves

    glPopMatrix();
}
// Variables to control the translation of the torch
bool torchMoving = false;  // Flag to control the movement state
float translationTorchX = 0.0f;  // Initial translation along x-axis for the torch
float translationTorchZ = 0.0f;  // Initial translation along z-axis for the torch
float torchmovementSpeed = 0.1f; // Speed at which the torch moves
void drawToarch(float x, float y, float z) {
    // Draw the trunk (cylinder)
    glPushMatrix();
    // Apply translation along x and z axes if the torch is moving
    if (torchMoving) {
        translationTorchX += torchmovementSpeed;  // Move torch along the x-axis
        translationTorchZ += torchmovementSpeed;  // Move torch along the z-axis
    }
    glTranslatef(x + translationTorchX, y, z + translationTorchZ);  // Position the trunk
    glColor3f(0.55f, 0.27f, 0.07f);  // Brown color for the trunk

    GLUquadricObj *quadratic = gluNewQuadric();
    gluQuadricNormals(quadratic, GLU_SMOOTH);
    gluCylinder(quadratic, 0.3f, 0.3f, 1.f, 20, 20);  // Trunk size
    glPopMatrix();
    // Draw the leaves (spheres) just above the trunk, closely attached
    glPushMatrix();
    glTranslatef(x + translationTorchX, y + 0.5f, z + translationTorchZ);  // Position the foliage right at the top of the trunk
    glColor3f(1.0f, 1.0f, 0.0f);   // Yellow color for the torch

    // Draw a solid sphere to represent the sun
    glutSolidSphere(0.55f, 20, 20);  // Radius 2.0, 50 slices, 50 stacks
    // Draw 8 rays
    float rayLength = 2.0f;  // Length of the rays
    for (int i = 0; i < 4; ++i) {
        float angle = i * 45.0f;  // Angle in degrees (45 degrees between each ray)
        float radian = angle * 3.14159f / 180.0f;  // Convert to radians

        // Calculate the end point of the ray
        float x = rayLength * cos(radian);
        float y = rayLength * sin(radian);

        // Set the color for the rays (optional, can be set to a different color)
        glColor3f(1.0f, 1.0f, 0.0f);  // Yellow color for rays

        // Draw the ray as a line from the center of the sun to the calculated point
        glBegin(GL_LINES);
        glVertex3f(0.0f, 0.0f, 0.0f);  // Start at the center of the sun
        glVertex3f(x, y, 0.0f);  // End at the calculated point for the ray
        glEnd();
    }
    glPopMatrix();
}
void checkFinishLine() {
    // Check if the player's x-coordinate is within the finish line range and z-coordinate is at 0
    if (playerPosX >= FINISH_LINE_X_MIN && playerPosX <= FINISH_LINE_X_MAX && abs(playerPosZ) < 0.01f) {
        // If the player is within the finish line range, hide the finish line
        finishLineVisible = false;  // This will hide the finish line
    }
}
float finishLineY = 6.0f;  // Initial position for the finish line
float finishLineSpeed = 0.05f;  // Speed of the oscillation
float finishLineRange = 0.2f;  // Maximum height the finish line will move (up and down)

void drawFinishLine() {
    if (!finishLineVisible) {
        return;  // If the finish line is not visible, do not draw it
    }
    finishLineY = finishLineRange * sin(glutGet(GLUT_ELAPSED_TIME) * finishLineSpeed);

    float lineHeight = 1.5 + finishLineY;  // Y position for the finish line (adjust based on your needs)
    float lineLength = 0.0005f; // Horizontal distance between the inner and outer walls (8.0f - (-4.0f))

    // Set the color for the finish line (white color)
    glColor3f(0.0f, 0.0f, 0.0f);

    // Draw 3 vertical lines spaced horizontally
    for (int i = 0; i < 3; ++i) {
        float yOffset = lineHeight + i * 0.5f;  // Adjust vertical spacing between lines (increase the value to space them further apart)

        glBegin(GL_LINES);
        // Draw the line between the walls (inner radius -4.0f to outer radius 8.0f)
        glVertex3f(3.0f, yOffset, 0.0f);  // Left side of the line (inner wall)
        glVertex3f(8.0f, yOffset, 0.0f);  // Right side of the line (outer wall)
        glEnd();
    
    }
}
float rotationAngle = 90.0f;  // Initial rotation angle
bool rotationActive = false;  // Flag to toggle rotation animation
void updateRotation() {
    if (rotationActive) {
        rotationAngle += 1.0f;  // Increment the angle
        if (rotationAngle > 360.0f) {
            rotationAngle -= 360.0f;  // Keep the angle within 0-360 degrees
        }
    }
}
void drawPillarLight(float x, float y, float z, float cylinderHeight, float cylinderRadius, float lineHeight, float lineRadius, float sphereRadius) {
    GLUquadric* quadric = gluNewQuadric();

    // Step 1: Create the Cylinder (Pillar)
    glPushMatrix();
    glTranslatef(x, y, z);  // Position the cylinder
    
    glRotatef(90.0f, 1.0f, 0.0f, 0.0f);  // Rotate the cylinder to make it vertical
    glColor3f(0.8f, 0.8f, 0.8f);  // Set the color of the cylinder (the pillar)
    gluCylinder(quadric, cylinderRadius, cylinderRadius, cylinderHeight, 32, 32);  // Draw the pillar (cylinder)
    glPopMatrix();
    
    // Step 2: Create the Line (hanging part)
    glPushMatrix();
    glTranslatef(4.0f, 5.0f, 18.90f);  // Position the line just below the cylinder
    if (rotationActive) {
        glRotatef(rotationAngle, 1.0f, 0.0f, 1.0f);  // Rotate around Y-axis
    }
    glRotatef(-90.0f, 0.0f, 1.0f, 0.0f);  // Rotate the line to lie along the Z-axis (horizontal)
    glColor3f(0.5f, 0.5f, 0.5f);  // Set the color of the line (gray)
    gluCylinder(quadric, lineRadius, lineRadius, lineHeight, 32, 32);  // Draw the line (cylinder)
    glPopMatrix();

    // Step 3: Attach the Bulb (Sphere)
    glPushMatrix();
    glTranslatef(3.90f, 5.0f , 19.625f);  // Position the bulb at the end of the line
    if (rotationActive) {
        glRotatef(rotationAngle, 0.0f, 1.0f, 0.0f);  // Rotate around Y-axis
    }
    glColor3f(1.0f, 1.0f, 0.0f);  // Set the color of the bulb (yellow)
    glutSolidSphere(sphereRadius, 32, 32);  // Draw the sphere (bulb)
    glPopMatrix();

    gluDeleteQuadric(quadric);
}

// Function to draw the athletics track
void drawTrack() {
    glColor3f(0.5f, 0.5f, 0.5f);  // Grey color for track

    glBegin(GL_POLYGON);
    // Draw the outer part of the track (oval shape)
    for (int i = 0; i <= 360; i++) {
        float angle_rad = i * 3.14159f / 180.0f;
        float x = cos(angle_rad) * 10.0f;
        float z = sin(angle_rad) * 5.0f;
        glVertex3f(x, 0.5f, z);
    }
    glEnd();

    // Draw lanes inside the track
    glColor3f(1.0f, 1.0f, 1.0f);  // White color for lane lines

    // Draw 8 lanes (we assume each lane is defined by a ring with different radii)
    int numLanes = 8;
    float laneWidth = 0.5f;  // Width of each lane
    for (int i = 1; i <= numLanes; i++) {
        glBegin(GL_LINE_LOOP);  // Use GL_LINE_LOOP to draw the lane lines
        for (int j = 0; j <= 360; j++) {
            float angle_rad = j * 3.14159f / 180.0f;
            float outer_x = cos(angle_rad) * (10.0f - i * laneWidth);  // Adjusting radius for lanes
            float outer_z = sin(angle_rad) * (5.0f - i * laneWidth);  // Adjusting radius for lanes
            glVertex3f(outer_x, 0.5f, outer_z);
        }
        glEnd();
    }
}
float wallColorChangeInterval = 1000.0f;  // Time interval for color change in milliseconds (1 second)
float timeElapsed = 0.0f;
// Function to change color based on elapsed time
void updateWallColors() {
    timeElapsed = glutGet(GLUT_ELAPSED_TIME) / wallColorChangeInterval;  // Get the elapsed time in terms of the interval
    float colorFactor = sin(timeElapsed * 3.14159f);  // Use sine wave for smooth oscillation

    // Calculate color components for oscillation between gray, white, and black
    float grayValue = (colorFactor + 1.0f) / 2.0f;  // Oscillates between 0 (black) and 1 (white)
    
    // For gray, we want all RGB values to be equal, so set each color component to the same value
    float red = grayValue;  // Gray, between black and white
    float green = grayValue;  // Gray, between black and white
    float blue = grayValue;  // Gray, between black and white

    // Set the new color for the walls: Oscillating between gray, white, and black
    glColor3f(red, green, blue);  // Smooth color change based on time
}
// Function to draw a single wall using rectangular prism and cube
void drawWall(GLfloat x, GLfloat y, GLfloat z, GLfloat width, GLfloat height, GLfloat depth) {
    // Main rectangular prism (wall)
    updateWallColors();  // Call the function to update the color
    glPushMatrix();
    //glColor3f(0.8f, 0.8f, 0.8f);  // Light gray color for the wall
    glTranslatef(x, y, z);  // Position the wall
    glScalef(width, height, depth);  // Scale the cube to form a rectangular prism
    glutSolidCube(1.0f);  // Draw the rectangular prism
    glPopMatrix();

    // Cube as support or feature at the base (optional, can be removed or scaled)
    glPushMatrix();
    //glColor3f(0.5f, 0.5f, 0.5f);  // Darker gray color for the cube
    glTranslatef(x, y - 0.5f, z);  // Position the cube below the wall
    glutSolidCube(1.0f);  // Create the support cube
    glPopMatrix();
}
// Function to draw a solid inner wall around the track with tilt
void drawSolidInnerWall(float centerX, float centerY, float centerZ, float height, float thickness) {
    //glColor3f(0.6f, 0.6f, 0.6f);  // Light gray color for the inner wall
    updateWallColors();  // Call the function to update the color

    int segments = 360;  // Define the number of segments for a smoother wall
    float innerRadiusX = 4.0f;  // Radius for the x-axis (last inner lane)
    float innerRadiusZ = 1.0f;  // Radius for the z-axis (last inner lane)

    glBegin(GL_QUAD_STRIP);  // Draw the wall as a quad strip for depth

    for (int i = 0; i <= segments; i++) {
        float angle = i * 3.14159f / 180.0f;  // Convert degrees to radians

        // Calculate positions with tilt along the y-axis
        float x = cos(angle) * innerRadiusX + centerX;
        float z = sin(angle) * innerRadiusZ + centerZ;

        // Create a tilt effect along the y-axis
        float yBase = centerY; //centerY - (x / 10.0f);  // Slant with the x position

        // Draw top and bottom vertices for the wall segment
        glVertex3f(x, yBase, z);               // Bottom point
        glVertex3f(x, yBase + height, z);      // Top point
    }

    glEnd();
}
void drawSolidOuterWall(float centerX, float centerY, float centerZ, float height, float thickness) {
   // glColor3f(0.4f, 0.4f, 0.4f);  // Slightly darker gray color for the outer wall
    updateWallColors();  // Call the function to update the color

    int segments = 360;  // Define the number of segments for a smoother wall
    float outerRadiusX = 8.0f;  // Precise radius for the x-axis (outer lane)
    float outerRadiusZ = 4.0f;   // Precise radius for the z-axis (outer lane)

    glBegin(GL_QUAD_STRIP);  // Draw the wall as a quad strip for depth

    for (int i = 0; i <= segments; i++) {
        float angle = i * 3.14159f / 180.0f;  // Convert degrees to radians

        // Calculate positions with tilt along the y-axis
        float x = cos(angle) * outerRadiusX + centerX;
        float z = sin(angle) * outerRadiusZ + centerZ;

        // Create a tilt effect along the y-axis
        float yBase = centerY; //centerY - (x / 10.0f);  // Slant with the x position

        // Draw top and bottom vertices for the wall segment
        glVertex3f(x, yBase, z);               // Bottom point
        glVertex3f(x, yBase + height, z);      // Top point
    }

    glEnd();
}
// Function to draw tilted circular lines above the walls
void drawTiltedCirclesAboveWalls(float centerX, float centerY, float centerZ, float radiusX, float radiusZ, float height) {
    glColor3f(1.0f, 1.0f, 1.0f);  // White color for the circles

    int segments = 360;  // Define the number of segments for smoother circles

    // Draw the first circular line
    glBegin(GL_LINE_LOOP);
    for (int i = 0; i <= segments; i++) {
        float angle = i * 3.14159f / 180.0f;  // Convert degrees to radians

        // Calculate positions with tilt along the y-axis
        float x = cos(angle) * radiusX + centerX;
        float z = sin(angle) * radiusZ + centerZ;

        // Apply tilt (similar to the walls)
        float yBase = centerY + height; // Adjust height to position above the wall

        // Draw the circle segment
        glVertex3f(x, yBase, z);
    }
    glEnd();

    // Draw the second circular line (slightly adjusted)
    glBegin(GL_LINE_LOOP);
    for (int i = 0; i <= segments; i++) {
        float angle = i * 3.14159f / 180.0f;  // Convert degrees to radians

        // Calculate positions with tilt along the y-axis
        float x = cos(angle) * (radiusX - 1.0f) + centerX;  // Smaller radius for the second circle
        float z = sin(angle) * (radiusZ - 1.0f) + centerZ;  // Smaller radius for the second circle

        // Apply tilt (similar to the walls)
        float yBase = centerY + height + 1.0f; // Adjust height to position above the first circle

        // Draw the circle segment
        glVertex3f(x, yBase, z);
    }
    glEnd();
}

// Function to draw the track and surrounding walls
void drawTrackWithWalls() {
    // Draw the main track (you'll need to implement this separately)
    drawTrack();  // Call your existing function to draw the track (not shown here)

    // Draw walls around the track (Adjust these values to fit your track)
    // Left side wall
    drawWall(-10.0f, 2.0f, 0.8f, 0.5f, 4.0f, 15.0f);  // x, y, z, width, height, depth
    // Right side wall
    drawWall(10.0f, 2.0f, 1.0f, 0.5f, 4.0f, 15.0f);  // x, y, z, width, height, depth
    // Back side wall
    drawWall(0.0f, 2.0f, -7.0f, 20.0f, 4.0f, 0.5f);  // x, y, z, width, height, depth
    // Front side wall (or track end)
    drawWall(0.0f, 2.0f, 8.5f, 20.0f, 4.0f, 0.5f);  // x, y, z, width, height, depth
// Draw the tilted inner wall
    drawSolidInnerWall(0.0f, 1.0f, 0.0f, 1.5f, 0.3f);  // Height and thickness as desired
    drawSolidOuterWall(0.0f, 1.0f, 0.0f, 1.5f, 0.3f);  // Outer wall parameters
     // Draw the tilted circular lines above the walls
    drawTiltedCirclesAboveWalls(0.0f, 1.0f, 0.0f, 8.0f, 4.0f, 5.0f);  // Adjust these values for positioning and size
}



// Function to set up the camera position and view
/*void setupCamera() {
    glLoadIdentity();  // Reset the current matrix
    gluLookAt(0.0f, 15.0f, 30.0f,  // Camera position
              0.0f, 0.0f, 0.0f,    // Look at the origin
              0.0f, 10.0f, 0.0f);   // Up direction
}*/
// Function to update camera angle (e.g., rotating the camera)
void updateCamera() {
    glLoadIdentity();  // Reset transformations
    GLfloat camX = sin(angle) * 30.0f;  // Calculate X position based on angle
    GLfloat camZ = cos(angle) * 30.0f;  // Calculate Z position based on angle
    gluLookAt(camX, 15.0f, camZ,  // Camera position
              0.0f, 0.0f, 0.0f,  // Look at the center of the scene
              0.0f, 1.0f, 0.0f);  // Up direction
}
int viewMode = 0;  // Default view (front view)
void setupCamera() {
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    gluPerspective(45.0f, (GLfloat)window_width / (GLfloat)window_height, 0.1f, 100.0f);  // Set perspective
    
    glMatrixMode(GL_MODELVIEW);
    glLoadIdentity();  // Clear previous transformations

    // Adjust camera position based on the view
    if (viewMode == 1) {  // Front view
        gluLookAt(0.0f, 15.0f, 30.0f,   // Camera position (x, y, z)
                  0.0f, 0.0f, 0.0f,   // Look at the center
                  0.0f, 1.0f, 0.0f);  // Up direction (Y-axis)
    } 
    else if (viewMode == 2) {  // Top view
        gluLookAt(0.0f, 55.0f, 5.0f,   // Camera position (x, y, z)
                  0.0f, 0.0f, 0.0f,   // Look at the center
                  0.0f, 0.0f, -1.0f); // Up direction (Z-axis flipped)
    } 
    else if (viewMode == 3) {  // Side view
        gluLookAt(50.0f, 25.0f, 0.0f,   // Camera position (x, y, z)
                  0.0f, 0.0f, 0.0f,   // Look at the center
                  0.0f, 1.0f, 0.0f);  // Up direction (Y-axis)
    }else {
        // Dynamic view using cameraX, cameraY, and cameraZ
        gluLookAt(cameraX, cameraY, cameraZ,   // Camera position
                  0.0f, 0.0f, 0.0f,   // Look at the center
                  0.0f, 1.0f, 0.0f);  // Up direction (Y-axis)
    }
}


// Function to handle key press events
void handleKeypress(unsigned char key, int x, int y) {
    if (key == 'i') {  // Move camera forward along the z-axis (positive z direction)
                cameraZ -= movementSpeed;
    }
    if (key == 'k') {  // Move camera backward along the z-axis (negative z direction)
               cameraZ += movementSpeed;
    }
    if (key == 'j') {  // Move camera left along the x-axis (negative x direction)
                cameraX -= movementSpeed;
    }
    if (key == 'l') {  // Move camera right along the x-axis (positive x direction)
                cameraX += movementSpeed;
    }
    if (key == 'u') {  // Move camera up along the y-axis
        cameraY += movementSpeed;
    }
    if (key == 'o') {  // Move camera down along the y-axis
        cameraY -= movementSpeed;
    }
    if (key == 't') {  // Toggle scale animation for the tree
        treeScaling = !treeScaling;  // Toggle scaling state
    }
    if (key == 'r') {  // Toggle torch movement
        torchMoving = !torchMoving;  // Toggle movement state
    }
    if (key == 'c') {  // Press 'C' to toggle color change
        colorChangeActive = !colorChangeActive;
    }
    if (key == 'b') {  // Press 'C' to toggle cloud color change
        cloudColorChangeActive = !cloudColorChangeActive;
    }
    if (key == 'm') {  // Press 'R' to toggle rotation
        rotationActive = !rotationActive;
    }
    if (key == 'w') {  // Move forward (in positive z direction)
        playerPosZ -= playerSpeed;
        playerRotation = 0.0f;  // Facing forward
    }
    if (key == 's') {  // Move backward (in negative z direction)
        playerPosZ += playerSpeed;
        playerRotation = 180.0f;  // Facing backward
    }
    if (key == 'a') {  // Move left (in negative x direction)
        playerPosX -= playerSpeed;
        playerRotation = 90.0f;  // Facing left
    }
    if (key == 'd') {  // Move right (in positive x direction)
        playerPosX += playerSpeed;
        playerRotation = 270.0f;  // Facing right
    }
    if (key == '1') {
        viewMode = 1;  // Set to front view
    }
    else if (key == '2') {
        viewMode = 2;  // Set to top view
    }
    else if (key == '3') {
        viewMode = 3;  // Set to side view
    }
    
    glutPostRedisplay();  // Request to update the screen
}

// Function to draw the player model
void drawPlayer() {
    glPushMatrix();
    glTranslatef(playerPosX, 1.0f, playerPosZ);  // Update player position based on angle
    glRotatef(playerRotation, 0.0f, 1.0f, 0.0f);  // Rotate around Y-axis (vertical)
    // Set the player color to brown
    glColor3f(0.6f, 0.3f, 0.0f);  // Brown color (R: 0.6, G: 0.3, B: 0.0)

    // Draw head (sphere)
    glPushMatrix();
    glTranslatef(0.0f, 1.5f, 0.0f);  // Position head above body
    glutSolidSphere(0.5f, 20, 20);  // Sphere with radius 0.5
    glPopMatrix();

    // Draw body (cube)
    glPushMatrix();
    glTranslatef(0.0f, 0.5f, 0.0f);  // Position body below head
    glutSolidCube(1.0f);  // Cube with size 1.0
    glPopMatrix();

    // Draw left arm (cylinder)
    glPushMatrix();
    glTranslatef(-0.75f, 0.5f, 0.0f);  // Position left arm
    glRotatef(90.0f, 1.0f, 0.0f, 0.0f);  // Rotate arm to position
    glutSolidCone(0.2f, 1.0f, 20, 20);  // Left arm modeled as cone (as a substitution)
    glPopMatrix();

    // Draw right arm (cylinder)
    glPushMatrix();
    glTranslatef(0.75f, 0.5f, 0.0f);  // Position right arm
    glRotatef(90.0f, 1.0f, 0.0f, 0.0f);  // Rotate arm to position
    glutSolidCone(0.2f, 1.0f, 20, 20);  // Right arm modeled as cone (as a substitution)
    glPopMatrix();

    // Draw left leg (cone)
    glPushMatrix();
    glTranslatef(-0.3f, -0.5f, 0.0f);  // Position left leg
    glRotatef(90.0f, 1.0f, 0.0f, 0.0f);  // Rotate leg to position
    glutSolidCone(0.3f, 1.0f, 20, 20);  // Left leg modeled as cone
    glPopMatrix();

    // Draw right leg (cone)
    glPushMatrix();
    glTranslatef(0.3f, -0.5f, 0.0f);  // Position right leg
    glRotatef(90.0f, 1.0f, 0.0f, 0.0f);  // Rotate leg to position
    glutSolidCone(0.3f, 1.0f, 20, 20);  // Right leg modeled as cone
    glPopMatrix();

    glPopMatrix();
}
void updatePlayerPosition() {
    // Prevent player from moving past the X boundary
    if (playerPosX < -7.5f) {
        playerPosX = -7.5f;  // Keep the player at the X boundary (left)
    }
    if (playerPosX > 7.5f) {
        playerPosX = 7.5f;  // Keep the player at the X boundary (right)
    }

    // Prevent player from moving past the Z boundary
    if (playerPosZ < -3.0f) {
        playerPosZ = -3.0f;  // Keep the player at the Z boundary (bottom)
    }
    if (playerPosZ > 3.0f) {
        playerPosZ = 3.0f;  // Keep the player at the Z boundary (top)
    }
}
void updateTimer(int value) {
    if (timer > 0) {
        timer--;  // Decrease timer by 1 second
        glutPostRedisplay();  // Request a screen refresh to update the timer display
        glutTimerFunc(1000, updateTimer, 0);  // Call this function again in 1 second
    }
}
bool checkIfPlayerCrossedFinishLine() {
    // Check if the player's x-coordinate is within the finish line range and z-coordinate is at 0
    if (playerPosX >= FINISH_LINE_X_MIN && playerPosX <= FINISH_LINE_X_MAX && abs(playerPosZ) < 0.01f) {
        return true;
    }
     return false;  // This will hide the finish line
 }
 void displayEndGameScreen() {
    // Switch to orthographic projection (2D mode)
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    glOrtho(0, window_width, 0, window_height, -1, 1);  // Set the 2D viewing volume
    glMatrixMode(GL_MODELVIEW);  // Switch back to modelview matrix

    glClear(GL_COLOR_BUFFER_BIT);  // Clear the screen to black

    // Set up 2D mode for text rendering (ensuring it's on the screen)
    glLoadIdentity();
    glColor3f(1, 1, 1);  // Set the text color to white

    char message[20];
    if (gameWon) {
        sprintf(message, "GAME WON!");
    } else {
        sprintf(message, "GAME LOSE");
    }

    // Position the text in the center of the screen
    glRasterPos2f(window_width / 2 - 50, window_height / 2);  // Center the text

    // Render the message text character by character
    for (int i = 0; message[i] != '\0'; i++) {
        glutBitmapCharacter(GLUT_BITMAP_TIMES_ROMAN_24, message[i]);
    }

    glutSwapBuffers();  // Swap buffers to show the end game message
}
void setupLights() {
	GLfloat ambient[] = { 0.7f, 0.7f, 0.7, 1.0f };
	GLfloat diffuse[] = { 0.6f, 0.6f, 0.6, 1.0f };
	GLfloat specular[] = { 1.0f, 1.0f, 1.0, 1.0f };
	GLfloat shininess[] = { 50 };
	glMaterialfv(GL_FRONT_AND_BACK, GL_AMBIENT, ambient);
	glMaterialfv(GL_FRONT, GL_DIFFUSE, diffuse);
	glMaterialfv(GL_FRONT, GL_SPECULAR, specular);
	glMaterialfv(GL_FRONT, GL_SHININESS, shininess);

	GLfloat lightIntensity[] = { 0.7f, 0.7f, 1, 1.0f };
	GLfloat lightPosition[] = { -7.0f, 6.0f, 3.0f, 0.0f };
	glLightfv(GL_LIGHT0, GL_POSITION, lightIntensity);
	glLightfv(GL_LIGHT0, GL_DIFFUSE, lightIntensity);
}
// Function to update the scene
void display() {
    if (gameOver) {
        if (!gameOverFlag) {
            gameOverFlag = true; // Prevent the game from resetting the message too soon
            displayEndGameScreen();
        }
        return;  // Stop rendering the rest of the game
    }
    setupLights();
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);  // Clear the screen
    glLoadIdentity();  // Reset the view
    //setupCamera();  // Set up camera view
    float lookX = cameraX + sin(cameraAngleY);
    float lookY = cameraY + sin(cameraAngleX);
    float lookZ = cameraZ - cos(cameraAngleY);

    // Set the camera position and orientation
    gluLookAt(cameraX, cameraY, cameraZ,  // Camera position
              lookX, lookY, lookZ,        // Look-at point
              0.0f, 1.0f, 0.0f);         // Up vector
    updateCamera();  // Update the camera position based on angle (for rotating effect)
    // Set parameters for the ground's dimensions and position
    float groundWidth = 50.0f;
    float groundDepth = 50.0f;
    setupCamera();  // Set the camera based on the current viewMode
    // Draw the ground at the base level (y = 0.0f)
    drawGround(0.0f, 0.0f, 0.0f, groundWidth, groundDepth);
    drawSky();
    drawTrack();  // Draw the athletics track
    drawTrackWithWalls();  // Draw the track with surrounding walls
    drawSun();
    updateSunColor();
    drawPillarLight(3.0f, 5.0f, 18.90f, 3.0f, 0.1f, 1.0f, 0.02f, 0.5f);  // Example position and size
    updateRotation();
    drawFinishLine();
    checkFinishLine();
    drawToarch(0.0f, 1.0f, 0.0f);
    drawTree(-3.0f, 5.0f, 18.90f);  // Position the tree at (5, 0, -10)
    drawCloud();
    drawCloud();
    drawPlayer();  // Draw the player model
    updatePlayerPosition();
    // If the player crosses the finish line, mark the game as won
    if (checkIfPlayerCrossedFinishLine()) {
        gameWon = true;
        gameOver = true;  // End the game if the player won
    }

    // If the timer runs out and the player didn't cross the finish line
    if (timer == 0 && !gameWon) {
        gameOver = true;  // End the game if time's up and player didn't win
    }
    glPushMatrix();
    glColor3f(1, 1, 1);  // Set the color of the text to white
    // Display the timer text
    char timerText[20];
    sprintf(timerText, "Time: %d", timer);  // Format the timer as text
    glRasterPos3f(4.75f, 5.5f, 21.0f);  // Adjust these coordinates for bottom-right
    for (int i = 0; timerText[i] != '\0'; i++) {
        glutBitmapCharacter(GLUT_BITMAP_TIMES_ROMAN_24, timerText[i]);  // Render each character
    }
    glPopMatrix();
    glutSwapBuffers();  // Swap the buffers to display the image
}


// Function to handle window resizing
void reshape(int w, int h) {
    glViewport(0, 0, w, h);  // Set the new viewport size
    glMatrixMode(GL_PROJECTION);  // Switch to projection matrix
    glLoadIdentity();  // Reset the projection matrix
    gluPerspective(45.0f, (GLfloat)w / (GLfloat)h, 0.1f, 100.0f);  // Set the perspective
    glMatrixMode(GL_MODELVIEW);  // Switch to model view matrix
}



int main(int argc, char** argv) {
    glutInit(&argc, argv);  // Initialize GLUT
    glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGB | GLUT_DEPTH);  // Set display mode
    glutInitWindowSize(window_width, window_height);  // Set window size
    glutCreateWindow("Athletics Track with Boundary Walls");  // Create window with title
    initOpenGL();  // Initialize OpenGL settings
    glutDisplayFunc(display);  // Register display function
    glutKeyboardFunc(handleKeypress);
    glutReshapeFunc(reshape);  // Register reshape function
    glutTimerFunc(1000, updateTimer, 0);
    //glutIdleFunc(display);  // Continuously update the display to animate
    glutMainLoop();  // Enter the GLUT main loop
    return 0;
}

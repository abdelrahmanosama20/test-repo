#include <GL/glut.h>
#include <cmath>  // For sin and cos
#include <iostream>
#include <vector>
#include "include/stb_image.h"  // Adjust the path based on where you placed stb_image.h
#include <cstdlib> // Include for rand() and srand()
#include <ctime>   // Include for time()
//void spawnLotteryCoin(); // Function prototype


// Function prototype declarations
void displayGameOver();  // Declaration for the game over function


// Constants for player movement
const float MAX_JUMP_HEIGHT = 180.0f;  // Maximum height for the jump
const float JUMP_SPEED_INCREMENT = 100.0f;  // Increment for the jump speed
const float GRAVITY = 70.0f;  // Gravity to pull player down
float MOVE_SPEED = 20.0f; // Speed of horizontal movement
const float BACKGROUND_SPEED = 20.0f; // Speed of background movement
const float playerStopPoint = 0.7f * 800;  // 70% of the screen width




int collectibleThreshold = 7;  // Spawn a collectible every 7 obstacles
int powerUpThreshold = 7;  // Spawn a power-up every 7 obstacles
float speedIncrement = 0.1f; // Amount to increase speed each second
const float PLAYER_MOVE_SPEED = 20.0f; // Set to your desired speed
float lastFrameTime = 0.0f; // To store the last frame time
float deltaTime = 0.0f; // Time difference between frames
const int COLLECTIBLE_SPAWN_INTERVAL = 4; // Every 4 obstacles for collectibles
const int POWERUP_SPAWN_INTERVAL = 3;      // Every 3 obstacles for power-ups
int obstaclesSpawned = 0; // Counter for obstacles spawned
int obstaclesSinceLastCollectible = 0; // Track obstacles since last collectible
int obstaclesSinceLastPowerUp = 0;     // Track obstacles since last power-up
float lastTimeCheck = 0.0f; // To keep track of the last second check
float jumpHeight = 0.0f; // Current height of the jump
const int LOTTERY_COIN_TYPE = 2; // Assign a unique identifier for the lottery coin
const int LOTTERY_COIN_SPAWN_INTERVAL = 7;  // Every 7 obstacles for lottery coins
int obstaclesSinceLastLotteryCoin = 0; // Track obstacles since last lottery coin
int obstacleCounter = 0; // Initialize this somewhere in your game
bool isBouncingBack = false; // Flag for bounce back animation
const float bounceBackDistance = 2.0f; // Distance to move back on collision
bool isBackgroundMoving = true; // Flag to indicate if the background is moving



// Player position and size
float playerX = 50.0f, playerY = 50.0f;
float playerWidth = 50.0f, playerHeight = 100.0f;
bool isJumping = false;
bool isDucking = false; // Declare the isDucking variable
float jumpSpeed = 0.0f;  // Speed of the jump

// Game boundaries
float upperBoundary = 500.0f, lowerBoundary = 0.0f;
float lineSpacing = 2.0f;  // Small space between lines

// Health, score, and game time
int health = 5;
int score = 0;
int gameTime = 10;  // 60 seconds for the game

// Background texture
GLuint backgroundTexture;

// Background offset for continuous movement
float backgroundOffset = 0.0f; // Declare the backgroundOffset variable

// Define the Obstacle structure
struct Obstacle {
    float x, y;      // Position
    float width, height; // Dimensions
    bool isActive;   // Whether the obstacle is active
    bool hasLostLife; // Track if this obstacle has caused a life loss
};

// Define the Collectible structure
struct Collectible {
    float x, y;      // Position
    float width, height; // Dimensions
    bool isActive;   // Whether the collectible is active
};

// Define the Power-up structure
struct PowerUp {
    float x, y;      // Position
    float width, height; // Dimensions
    bool isActive;   // Whether the power-up is active
    int type;        // Type of power-up (e.g., speed, invincibility)
   // float effectDuration; // Duration of the effect
};
struct LotteryCoin {
    float x, y; // X position  // Y position
    float width, height;
    bool isActive; // To check if the coin is active
    int type; // Type identifier, can use LOTTERY_COIN_TYPE for identification
};
LotteryCoin lotteryCoin = { .x = 200, .y = 300, .isActive = false }; // Ensure this is the only definition

enum GameState { PLAYING, GAME_OVER };
GameState currentState = PLAYING; // Initialize game state to playing
enum BackgroundState { MOVING, STOPPED };
BackgroundState backgroundState = MOVING; // Initialize background state

bool gameRunning = true; // Flag for the game loop
bool collisionDetected = false; // Collision state
bool playerIsMoving = false; // Flag for player movement

bool obstaclesMoving = true; // Flag for obstacle movement

void updateBackground() {
    switch (backgroundState) {
        case MOVING:
            // Update background position for moving
            break;
        case STOPPED:
            // Background remains static, do nothing
            break;
    }
}

// Vector to store obstacles
std::vector<Obstacle> obstacles;
std::vector<Collectible> collectibles;
std::vector<PowerUp> powerUps;
std::vector<LotteryCoin> lotteryCoins; // Vector to store lottery coins


// Function to load a texture
GLuint loadTexture(const char* filename) {
    int width, height, nrChannels;
    std::cout << "Loading texture: " << filename << std::endl; // Debug print
    unsigned char* data = stbi_load(filename, &width, &height, &nrChannels, 0);
    if (!data) {
        std::cout << "Failed to load texture: " << filename << std::endl;
        std::cout << "Error: " << stbi_failure_reason() << std::endl; // More detailed error message
        return 0;
    }

    GLuint texture;
    glGenTextures(1, &texture);
    glBindTexture(GL_TEXTURE_2D, texture);
    
    // Check the number of channels (3 for RGB, 4 for RGBA)
    if (nrChannels == 3) {
        glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width, height, 0, GL_RGB, GL_UNSIGNED_BYTE, data);
    } else if (nrChannels == 4) {
        glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, width, height, 0, GL_RGBA, GL_UNSIGNED_BYTE, data);
    }

    glGenerateMipmap(GL_TEXTURE_2D);
    stbi_image_free(data);
    return texture;
}

// Function to draw text on the screen
void drawText(const char* text, float x, float y) {
    glRasterPos2f(x, y);
    for (const char* c = text; *c != '\0'; c++) {
        glutBitmapCharacter(GLUT_BITMAP_HELVETICA_18, *c);
    }
}

// Function to draw a heart shape (used for lives)
void drawHeart(float x, float y) {
    glBegin(GL_POLYGON);
    glColor3f(1.0f, 0.0f, 0.0f); // Red color for the heart

    // Heart shape using parametric equation
    for (float angle = 0; angle < 2 * 3.14159; angle += 0.01) {
        float x1 = (16 * sin(angle) * sin(angle) * sin(angle)) * 0.5f; // Further reduced size
        float y1 = (13 * cos(angle) - 5 * cos(2 * angle) - 2 * cos(3 * angle) - cos(4 * angle)) * 0.5f; // Further reduced size
        glVertex2f(x + x1, y + y1);
    }

    glEnd();
}

void drawDashedHeartContainer(float x, float y, float heartWidth, float heartHeight, int numHearts) {
    float spacing = 5.0f;  // Reduce spacing between hearts to make the rectangle narrower
    float containerWidth = heartWidth * numHearts + spacing * (numHearts - 1); // Width of the rectangle (considering spacing)
    float containerHeight = heartHeight + 10.0f;  // Height of the rectangle

    // Enable dashed line stipple
    glEnable(GL_LINE_STIPPLE);
    glLineStipple(1, 0x00FF);   // Set dash pattern

    // Draw the dashed rectangle
    glColor3f(1.0f, 1.0f, 1.0f);  // White color for the rectangle
    glBegin(GL_LINE_LOOP);
    glVertex2f(x, y);                             // Bottom-left corner
    glVertex2f(x + containerWidth, y);            // Bottom-right corner
    glVertex2f(x + containerWidth, y + containerHeight);  // Top-right corner
    glVertex2f(x, y + containerHeight);           // Top-left corner
    glEnd();

    // Draw vertical dashed lines between hearts
    for (int i = 1; i < numHearts; i++) {
        float lineX = x + i * (heartWidth + 10.0f);  // Calculate x-position for each dashed line
        glBegin(GL_LINES);
        glVertex2f(lineX, y);                          // Start at the bottom of the container
        glVertex2f(lineX, y + containerHeight);        // End at the top of the container
        glEnd();
    }

    glDisable(GL_LINE_STIPPLE);  // Disable dashed effect

    // Draw the hearts inside the rectangle
    for (int i = 0; i < numHearts; i++) {
        drawHeart(x + i * (heartWidth + 10.0f) + heartWidth / 2.0f, y + 10.0f);  // Adjust spacing and position
    }
}



// Function to draw the player (simple dog-like shape)
void drawPlayer() {
    glColor3f(0.5f, 0.35f, 0.05f);  // Brownish color for dog

    // Draw body
    glBegin(GL_QUADS);
    glVertex2f(playerX, playerY);                    // Bottom-left
    glVertex2f(playerX, playerY + playerHeight * 0.5f);     // Top-left
    glVertex2f(playerX + playerWidth * 1.0f, playerY + playerHeight * 0.5f);  // Top-right
    glVertex2f(playerX + playerWidth * 1.0f, playerY);      // Bottom-right
    glEnd();

    // Draw head (Triangle face)
    glColor3f(1.0f, 0.8f, 0.6f);  // Light skin tone for the face
    glBegin(GL_TRIANGLES);
    glVertex2f(playerX + playerWidth / 2.0f, playerY + playerHeight * 0.5f + 30.0f);  // Top of triangle (head)
    glVertex2f(playerX + playerWidth - 10.0f, playerY + playerHeight * 0.5f);  // Bottom-right of triangle
    glVertex2f(playerX + playerWidth - 50.0f, playerY + playerHeight * 0.50f);  // Bottom-left of triangle
    glEnd();

    // Draw legs (Two rectangles)
    glColor3f(0.4f, 0.2f, 0.0f);  // Darker brown for legs
    // Left leg
    glBegin(GL_QUADS);
    glVertex2f(playerX + 10.0f, playerY - 30.0f);  // Bottom-left of left leg
    glVertex2f(playerX + 10.0f, playerY);          // Top-left of left leg
    glVertex2f(playerX + 20.0f, playerY);          // Top-right of left leg
    glVertex2f(playerX + 20.0f, playerY - 30.0f);  // Bottom-right of left leg
    glEnd();

    // Right leg
    glBegin(GL_QUADS);
    glVertex2f(playerX + playerWidth - 20.0f, playerY - 30.0f);  // Bottom-left of right leg
    glVertex2f(playerX + playerWidth - 20.0f, playerY);          // Top-left of right leg
    glVertex2f(playerX + playerWidth - 10.0f, playerY);          // Top-right of right leg
    glVertex2f(playerX + playerWidth - 10.0f, playerY - 30.0f);  // Bottom-right of right leg
    glEnd();

    // Draw arms (Dashed lines)
    glColor3f(1.0f, 1.0f, 1.0f);  // white for arms
    glEnable(GL_LINE_STIPPLE);  // Enable line stipple (dashed effect)
    glLineStipple(1, 0x00FF);   // Set dash pattern (0x00FF for a simple dashed line)

    glBegin(GL_LINES);
    // Left arm (Dashed line)
    glVertex2f(playerX - 30.0f, playerY + playerHeight * 0.25f);  // Start of the left arm
    glVertex2f(playerX, playerY + playerHeight * 0.25f);  // End of the left arm

    // Right arm (Dashed line)
    glVertex2f(playerX + playerWidth, playerY + playerHeight * 0.25f);  // Start of the right arm
    glVertex2f(playerX + playerWidth + 30.0f, playerY + playerHeight * 0.25f);  // End of the right arm
    glEnd();

    glDisable(GL_LINE_STIPPLE);  // Disable line stipple (dashed effect)
}

// Function to draw the boundaries
void drawBoundaries() {
    glColor3f(1.0f, 1.0f, 1.0f);  // White boundaries
    glBegin(GL_LINES);
    // Upper boundary (4 lines)
    for (int i = 0; i < 4; i++) {
        glVertex2f(0.0f, upperBoundary - i * lineSpacing);  // Start of upper boundary
        glVertex2f(800.0f, upperBoundary - i * lineSpacing); // End of upper boundary
    }
    glEnd();
    // Lower boundary (4 lines)
    glBegin(GL_LINES);
    for (int i = 0; i < 4; i++) {
        glVertex2f(0.0f, lowerBoundary + 10 + i * lineSpacing);  // Start of lower boundary
        glVertex2f(800.0f, lowerBoundary + 10 + i * lineSpacing); // End of lower boundary
    }
    glEnd();
}

// Function to display health, score, and timer (health displayed as hearts)
void displayHUD() {
    float heartWidth = 50.0f;  // Set heart width
    float heartHeight = 50.0f;  // Set heart height
    int numHearts = health;    // Number of hearts to draw based on current health

    drawDashedHeartContainer(100.0f - 80.0f, 520.0f, heartWidth, heartHeight, numHearts);  // Call the function to draw hearts and container

    // Score display
    char scoreText[10];
    sprintf(scoreText, "Score: %d", score);
    drawText(scoreText, 300, 570);

    // Timer display
    char timerText[20];
    sprintf(timerText, "Time: %d", gameTime);
    drawText(timerText, 500, 570);
}

// Function to spawn obstacles
void spawnObstacle() {
    Obstacle newObstacle;
    // Randomly set the obstacle height and gap
    newObstacle.height = 40.0f; // Fixed height for simplicity
    newObstacle.width = 40.0f;   // Width of the obstacle
    newObstacle.y = lowerBoundary; // Position on the ground

    // Ensure a minimum gap between obstacles
    float gap = rand() % 200 + 100; // Random gap between 100 and 300 pixels
    if (!obstacles.empty()) {
        // Position the new obstacle based on the last one
        newObstacle.x = obstacles.back().x + obstacles.back().width + gap;
    } else {
        newObstacle.x = 800;  // Start from the right edge of the screen for the first obstacle
    }

    // Randomize the Y position within specified limits
    newObstacle.y = 50.0f + (rand() % 100); // Random height between 50 and 150

    newObstacle.isActive = true; // Mark it as active
    newObstacle.hasLostLife = false; // Initialize to false
    obstacles.push_back(newObstacle); // Add to the vector

    // Increment obstacleCounter when an obstacle is spawned
    obstacleCounter++;

    //if (obstacleCounter % 7 == 0) {
    // Spawn the lotteryCoin
    //spawnLotteryCoin(); // Implement this function
}




// Function to draw a cylinder (straw)
void drawCylinder(float x, float y, float radius, float height) {
    int numSegments = 20; // Number of segments for the cylinder
    float angleStep = 2.0f * M_PI / numSegments;

    // Draw the side of the cylinder
    glBegin(GL_QUAD_STRIP);
    for (int i = 0; i <= numSegments; ++i) {
        float angle = i * angleStep;
        float xPos = x + cos(angle) * radius;
        float yPos = y + sin(angle) * radius;

        glVertex2f(xPos, yPos); // Bottom vertex
        glVertex2f(xPos, yPos + height); // Top vertex
    }
    glEnd();
}

// Function to draw a zigzag pattern
void drawZigzag(float x, float y, float width, float amplitude, int segments) {
    float segmentLength = width / segments;

    // Draw left zigzag
    glBegin(GL_LINE_STRIP);
    for (int i = 0; i <= segments; ++i) {
        float offsetY = (i % 2 == 0) ? amplitude : -amplitude;  // Zigzag effect
        glVertex2f(x + i * segmentLength, y + offsetY);
    }
    glEnd();
}

// Function to draw obstacles
void drawObstacles() {
    for (const auto& obstacle : obstacles) {
        if (obstacle.isActive) {
            // Draw the cylindrical straw body
            glColor3f(1.0f, 1.0f, 1.0f); // Orange color for the straw
            drawCylinder(obstacle.x, obstacle.y, obstacle.width / 2, obstacle.height); // Draw the cylinder

            // Draw the left zigzag
            glColor3f(0.0f, 0.0f, 0.0f); // Black color for the zigzag
            drawZigzag(obstacle.x - obstacle.width / 2 - 20.0f, obstacle.y, 20.0f, 10.0f, 5); // Left zigzag (moved 10 units more to the left)

            // Draw the right zigzag
           drawZigzag(obstacle.x + obstacle.width / 2 + 5.0f, obstacle.y, 20.0f, 10.0f, 5); // Right zigzag
        }
    }
}


void spawnCollectible() {
    // Only spawn a collectible if none is active
    bool collectibleActive = false;
    for (auto& collectible : collectibles) {
        if (collectible.isActive) {
            collectibleActive = true;
            break;
        }
    }

    if (!collectibleActive) {
        Collectible newCollectible;
        newCollectible.width = 20.0f;
        newCollectible.height = 20.0f;
        newCollectible.x = 800;  // Start from the right edge of the screen
        newCollectible.y = 50.0f + (rand() % 150); // Random height within limits
        newCollectible.isActive = true;
        collectibles.push_back(newCollectible);  // Add it to the list
    }
}


// Function to draw collectibles
void drawCollectibles() {
    for (const auto& collectible : collectibles) {
        if (collectible.isActive) {
            // Draw base (Square)
            glColor3f(0.0f, 0.0f, 1.0f); // Gold color for the base
            glBegin(GL_QUADS);
            glVertex2f(collectible.x - 10, collectible.y); // Bottom-left
            glVertex2f(collectible.x - 10, collectible.y + 5); // Top-left
            glVertex2f(collectible.x + 10, collectible.y + 5); // Top-right
            glVertex2f(collectible.x + 10, collectible.y); // Bottom-right
            glEnd();

            // Draw gem (Circle)
            glColor3f(0.0f, 0.0f, 0.8f); // Yellow color for the gem
            float radius = 8.0f; // Radius for the gem
            glBegin(GL_TRIANGLE_FAN);
            glVertex2f(collectible.x, collectible.y + 5); // Center of the circle
            for (int i = 0; i <= 30; i++) { // Draw a circle
                float angle = 2.0f * M_PI * i / 30;
                float x = radius * cos(angle);
                float y = radius * sin(angle);
                glVertex2f(collectible.x + x, collectible.y + 5 + y);
            }
            glEnd();

            // Draw rays (Triangles) for the glowing effect
            glColor3f(0.0f, 0.5f, 1.0f); // Orange color for the rays
            for (int i = 0; i < 8; i++) { // 8 rays
                float angle = 2.0f * M_PI * i / 8;
                float xStart = collectible.x + radius * cos(angle);
                float yStart = collectible.y + 5 + radius * sin(angle);
                float xEnd = collectible.x + (radius + 5) * cos(angle);
                float yEnd = collectible.y + 5 + (radius + 5) * sin(angle);
                
                glBegin(GL_TRIANGLES);
                glVertex2f(collectible.x, collectible.y + 5); // Center of the circle
                glVertex2f(xStart, yStart); // Start of the ray
                glVertex2f(xEnd, yEnd); // End of the ray
                glEnd();
            }
        }
    }
}

void spawnPowerUp() {
    // Only spawn a power-up if none is active
    bool powerUpActive = false;
    for (auto& powerUp : powerUps) {
        if (powerUp.isActive) {
            powerUpActive = true;
            break;
        }
    }

    if (!powerUpActive) {
        PowerUp newPowerUp;
        newPowerUp.width = 20.0f;
        newPowerUp.height = 20.0f;
        newPowerUp.x = 800;  // Start from the right edge of the screen
        newPowerUp.y = 50.0f + (rand() % 150); // Random height within limits
        newPowerUp.isActive = true;
        powerUps.push_back(newPowerUp);  // Add it to the list
    }
}



// Function to draw power-ups
void drawPowerUps() {
    for (const auto& powerUp : powerUps) {
        if (powerUp.isActive) {
            // Draw the main body as a circle
            glColor3f(1.0f, 1.0f, 0.0f); // Yellow color for the power-up
            glBegin(GL_TRIANGLE_FAN);
            glVertex2f(powerUp.x + powerUp.width / 2, powerUp.y + powerUp.height); // Center of the circle
            int numSegments = 100; // Number of segments for the circle
            for (int i = 0; i <= numSegments; i++) {
                float theta = 2.0f * 3.1415926f * float(i) / float(numSegments); // Current angle
                float dx = (powerUp.width / 2) * cosf(theta); // Circle's radius
                float dy = (powerUp.height / 2) * sinf(theta);
                glVertex2f(powerUp.x + powerUp.width / 2 + dx, powerUp.y + powerUp.height + dy); // Vertex on the circle
            }
            glEnd();

            // Draw a star shape on top
            glColor3f(1.0f, 0.5f, 0.0f); // Orange color for the star
            glBegin(GL_TRIANGLES);
            // Example star points (5 points)
            for (int i = 0; i < 5; i++) {
                float angle = i * 2.0f * 3.1415926f / 5.0f - 3.1415926f / 2.0f; // Star rotation
                float x1 = powerUp.x + powerUp.width / 2 + 10 * cos(angle);
                float y1 = powerUp.y + powerUp.height + 10 * sin(angle);
                glVertex2f(x1, y1);
                angle += 2.0f * 3.1415926f / 5.0f; // Skip to the outer point
                x1 = powerUp.x + powerUp.width / 2 + 20 * cos(angle);
                y1 = powerUp.y + powerUp.height + 20 * sin(angle);
                glVertex2f(x1, y1);
            }
            glEnd();

            // Draw rays for glowing effect
            glColor3f(1.0f, 1.0f, 0.0f); // Bright yellow for rays
            for (int i = 0; i < 8; i++) {
                float angle = i * 2.0f * 3.1415926f / 8.0f; // Rays angle
                glBegin(GL_LINES);
                glVertex2f(powerUp.x + powerUp.width / 2 + 20 * cos(angle), powerUp.y + powerUp.height + 20 * sin(angle)); // Start of ray
                glVertex2f(powerUp.x + powerUp.width / 2 + 30 * cos(angle), powerUp.y + powerUp.height + 30 * sin(angle)); // End of ray
                glEnd();
            }

            // Draw a base shape (rectangle) for stability
            glColor3f(0.5f, 0.25f, 0.0f); // Brown color for base
            glBegin(GL_QUADS);
            glVertex2f(powerUp.x + (powerUp.width / 2) - 10, powerUp.y); // Bottom-left
            glVertex2f(powerUp.x + (powerUp.width / 2) - 10, powerUp.y - 10); // Top-left
            glVertex2f(powerUp.x + (powerUp.width / 2) + 10, powerUp.y - 10); // Top-right
            glVertex2f(powerUp.x + (powerUp.width / 2) + 10, powerUp.y); // Bottom-right
            glEnd();
        }
    }
}

//bool lotteryCoinActive = false;  // State to track if the lotteryCoin is active



void spawnLotteryCoin() {
   // Only spawn a lottery coin if none is active
    bool lotteryCoinActive = false;
    for (const auto& coin : lotteryCoins) {
        if (coin.isActive) {
            lotteryCoinActive = true;
            break;
        }
    }

    if (!lotteryCoinActive) {
        LotteryCoin newCoin;
        newCoin.width = 20.0f;
        newCoin.height = 20.0f;

        // Set the lottery coin to a fixed position
        newCoin.x = 400.0f;  // Fixed X position
        newCoin.y = 200.0f + (rand() % 150); // Random Y height within limits
        newCoin.isActive = true;
        lotteryCoins.push_back(newCoin);  // Add it to the list
    }
}


// Function to handle when an obstacle is removed
/*void handleObstaclePassed() {
    obstaclesSpawned++;  // Increment obstacle count as an obstacle passes
    obstaclesSinceLastCollectible++; // Update collectible counter
    obstaclesSinceLastPowerUp++; // Update power-up counter
    obstaclesSinceLastLotteryCoin++; // Update lottery coin counter

    // Check for spawning collectibles, power-ups, and lottery coins
    if (obstaclesSinceLastCollectible >= COLLECTIBLE_SPAWN_INTERVAL) {
        spawnCollectible();
        obstaclesSinceLastCollectible = 0; // Reset after spawning
    }

    if (obstaclesSinceLastPowerUp >= POWERUP_SPAWN_INTERVAL) {
        spawnPowerUp();
        obstaclesSinceLastPowerUp = 0; // Reset after spawning
    }

    if (obstaclesSinceLastLotteryCoin >= LOTTERY_COIN_SPAWN_INTERVAL) {
        spawnLotteryCoin(); // Call to spawn the lottery coin
        obstaclesSinceLastLotteryCoin = 0; // Reset after spawning
    }
}

// Deactivate the lotteryCoin when it is collected or needs to disappear
void deactivateLotteryCoin() {
    for (LotteryCoin& coin : lotteryCoins) {
        if (coin.type == LOTTERY_COIN_TYPE && coin.isActive) {
            coin.isActive = false;
            lotteryCoinActive = false;  // Set inactive for future spawning
        }
    }
}*/



void drawLotteryCoin(float x, float y) {
    // Draw the body of the power-up (hexagon)
    glBegin(GL_POLYGON);
    glColor3f(0.0f, 0.0f, 0.0f); // Green color for the body
    for (float angle = 0; angle < 360; angle += 360 / 6) { // Draw a hexagon
        float rad = angle * (3.14159f / 180.0f);
        glVertex2f(x + 20 * cos(rad), y + 20 * sin(rad)); // Adjust size as needed
    }
    glEnd();

    // Draw the inner dotted circle
    glColor3f(1.0f, 1.0f, 1.0f); // White color for the dot circle
    for (int i = 0; i < 12; i++) {
        float angle = i * (3.14159f / 6);
        float dotX = x + 10 * cos(angle); // Adjust radius as needed
        float dotY = y + 10 * sin(angle);
        glBegin(GL_POINTS);
        glVertex2f(dotX, dotY);
        glEnd();
    }

    // Draw the antenna (line)
    glColor3f(0.0f, 0.0f, 0.0f); // Black color for the antenna
    glBegin(GL_LINES);
    glVertex2f(x, y + 20); // Start point of the antenna
    glVertex2f(x, y + 40); // End point of the antenna
    glEnd();

    // Draw the triangles on both sides
    glColor3f(1.0f, 0.0f, 0.0f); // Red color for triangles
    // Left triangle
    glBegin(GL_TRIANGLES);
    glVertex2f(x - 15, y + 30); // Left base
    glVertex2f(x - 30, y + 40); // Peak of left triangle
    glVertex2f(x - 15, y + 40); // Right base
    glEnd();
    
    // Right triangle
    glBegin(GL_TRIANGLES);
    glVertex2f(x + 15, y + 30); // Left base
    glVertex2f(x + 30, y + 40); // Peak of right triangle
    glVertex2f(x + 15, y + 40); // Right base
    glEnd();
}




// Function to check collision
bool checkCollision() {
    for (auto& obstacle : obstacles) {
        if (obstacle.isActive) {
            // Check for collision with the obstacle
            bool isJumpingOver = isJumping && (playerY + playerHeight > obstacle.y + obstacle.height);
            bool isDuckingUnder = isDucking && (playerY < obstacle.y + obstacle.height);
            bool isFallingOnto = !isJumping && (playerY + playerHeight > obstacle.y) && (playerY + playerHeight < obstacle.y + obstacle.height);

            // If neither jumping nor ducking, check for normal collision
            if (!isJumpingOver && !isDuckingUnder && (playerX < obstacle.x + obstacle.width &&
                playerX + playerWidth > obstacle.x &&
                playerY < obstacle.y + obstacle.height &&
                playerY + playerHeight > obstacle.y)) {

                    // Trigger bounce back
                isBouncingBack = true; // Start bounce back
                playerX -= bounceBackDistance; // Move back 2 steps

                // Freeze background movement on collision
                backgroundState = STOPPED; // Stop the background movement
                
            

                // Optionally, stop background movement here
                // backgroundIsMoving = false; // Set this flag to stop background movement

                    
                // Check if this obstacle has already caused a life loss
                if (!obstacle.hasLostLife) {
                    health--; // Reduce health by 1
                    obstacle.hasLostLife = true; // Mark that this obstacle has caused a life loss
                    std::cout << "Lost a life! Health remaining: " << health << std::endl; // Debug message
                    if (health <= 0) {
                        currentState = GAME_OVER; // Change game state to GAME_OVER
                        std::cout << "Transitioning to Game Over state." << std::endl; // Debugging line
                    
                    }
                }
                return true; // Collision detected
            }
        }
    }

    // Check for collectibles
    for (auto& collectible : collectibles) {
        if (collectible.isActive) {
            // Check for collision with the collectible
            if (playerX < collectible.x + collectible.width &&
                playerX + playerWidth > collectible.x &&
                playerY < collectible.y + collectible.height &&
                playerY + playerHeight > collectible.y) {
                collectible.isActive = false; // Deactivate the collectible
                score += 10; // Increase score
            }
        }
    }

    // Check for power-ups
    for (auto& powerUp : powerUps) {
        if (powerUp.isActive) {
            // Check for collision with the power-up
            if (playerX < powerUp.x + powerUp.width &&
                playerX + playerWidth > powerUp.x &&
                playerY < powerUp.y + powerUp.height &&
                playerY + playerHeight > powerUp.y) {
                powerUp.isActive = false; // Deactivate the power-up
                // Handle power-up effect based on type
                if (powerUp.type == 0) {
                    // Speed boost effect
                    MOVE_SPEED *= 1.1; // Increase speed by 50%
                } else if (powerUp.type == 1) {
                    // Health increase effect
                    if (health < 5) { // Increase health only if it's below 5
                        health++;
                        std::cout << "Gained a life! Health: " << health << std::endl;
                    } else {
                        std::cout << "Health is already full!" << std::endl;
                    }
                }
            }
        }
    }

    // Check for lottery coin collisions
for (auto& coin : lotteryCoins) {
    if (coin.isActive) {
        // Check for collision with the lottery coin
        if (playerX < coin.x + coin.width &&
            playerX + playerWidth > coin.x &&
            playerY < coin.y + coin.height &&
            playerY + playerHeight > coin.y) {
            coin.isActive = false; // Make it disappear
            score += 30; // Increase score
            std::cout << "Collected a lottery coin! Score: " << score << std::endl; // Debug message
            }
        }
    }

    // In your collision detection
for (auto& powerUp : powerUps) {
    if (powerUp.isActive) {
        // Check for collision with the power-up
        if (playerX < powerUp.x + powerUp.width &&
            playerX + playerWidth > powerUp.x &&
            playerY < powerUp.y + powerUp.height &&
            playerY + playerHeight > powerUp.y) {
                
            // Deactivate the power-up
            powerUp.isActive = false;

           
        }
    }
}

    return false; // No collision
}

// Function to display everything
void Display() {
    glClear(GL_COLOR_BUFFER_BIT);  // Clear the screen

    // Check if the game is over
    if (currentState == GAME_OVER) {
        displayGameOver(); // Call to display game over message
        glFlush();
        return; // Exit the display function to avoid drawing the game environment
    }

    // Bind the background texture
    glBindTexture(GL_TEXTURE_2D, backgroundTexture);
    glColor3f(1.0f, 1.0f, 1.0f); // Reset color to white
    glEnable(GL_TEXTURE_2D);
    glBegin(GL_QUADS);
        glTexCoord2f(0.0f + backgroundOffset / 800.0f, 0.0f); glVertex2f(0.0f, 600.0f);  // Top-left
        glTexCoord2f(1.0f + backgroundOffset / 800.0f, 0.0f); glVertex2f(800.0f, 600.0f); // Top-right
        glTexCoord2f(1.0f + backgroundOffset / 800.0f, 1.0f); glVertex2f(800.0f, 0.0f);   // Bottom-right
        glTexCoord2f(0.0f + backgroundOffset / 800.0f, 1.0f); glVertex2f(0.0f, 0.0f);     // Bottom-left
    glEnd();
    glDisable(GL_TEXTURE_2D);

    // Handle jumping logic
if (isJumping) {
    // Check if the player is below the maximum jump height
    if (jumpHeight < MAX_JUMP_HEIGHT) {
        jumpHeight += JUMP_SPEED_INCREMENT * deltaTime;  // Move up
    } else {
        isJumping = false;  // Switch to falling after reaching peak
    }
} else {
    // Apply gravity when not jumping
    if (playerY > 50.0f) {
        jumpHeight -= GRAVITY * deltaTime; // Move down
        if (jumpHeight < 0.0f) {
            jumpHeight = 0.0f;  // Ensure player doesn't fall below ground level
            isJumping = false;  // Reset jumping state
        }
    }
}

// Update player's vertical position
playerY = 50.0f + jumpHeight; // Set player's Y position based on jumpHeight


    // Allow player to move forward continuously
    // Allow player to move forward continuously if the game is running and not in STOPPED state
    if (currentState == PLAYING && backgroundState == MOVING) {
    playerX += PLAYER_MOVE_SPEED * deltaTime; // Update horizontal position
    backgroundOffset += BACKGROUND_SPEED * deltaTime;  
    if (backgroundOffset > 800.0f) {
        backgroundOffset = 0.0f;  // Reset background offset for looping
    }
}

    // Update the position of obstacles
    for (auto& obstacle : obstacles) {
        if (obstacle.isActive) {
            obstacle.x -= BACKGROUND_SPEED * deltaTime;  // Move obstacles towards the player
            if (obstacle.x < -obstacle.width) {
                obstacle.isActive = false;  // Deactivate if off-screen
            }
        }
    }

    // Update the position of collectibles
    for (auto& collectible : collectibles) {
        if (collectible.isActive) {
            collectible.x -= BACKGROUND_SPEED * deltaTime;  // Move collectibles towards the player
            if (collectible.x < -collectible.width) {
                collectible.isActive = false;  // Deactivate if off-screen
            }
        }
    }

    // Update the position of power-ups
    for (auto& powerUp : powerUps) {
        if (powerUp.isActive) {
            powerUp.x -= BACKGROUND_SPEED * deltaTime;  // Move power-ups towards the player
            if (powerUp.x < -powerUp.width) {
                powerUp.isActive = false;  // Deactivate if off-screen
            }
        }
    }

    // Update the position of lottery coins
    for (auto& coin : lotteryCoins) {
        if (coin.isActive) {
            coin.x -= BACKGROUND_SPEED * deltaTime;  // Move power-ups towards the player
            if (coin.x < -coin.width) {
                coin.isActive = false;  // Deactivate if off-screen
            }
           /*drawLotteryCoin(coin.x, coin.y);
            // Move the coin
            coin.x -= MOVE_SPEED * deltaTime; // Adjust based on your game speed*/
        }
    }




    // Check for collisions
    checkCollision();

    // Draw the game environment
    drawPlayer();
    drawObstacles(); // Draw obstacles here
    drawCollectibles(); // Draw collectibles
    drawPowerUps(); // Draw power-ups here
    // Change this line
    drawLotteryCoin(lotteryCoin.x, lotteryCoin.y); // Call with both x and y coordinates

    drawBoundaries();
    displayHUD();

    glFlush();  // Flush the drawing
}

void gameLoop() {
    while (gameRunning) {
        // Handle jumping logic separately if needed
        if (isJumping) {
            // Implement your jumping logic here if required
        }

        // Check for collisions and update background state based on collisions
        checkCollision(); // Check for collisions

        // If a collision is detected, stop the background movement
        if (collisionDetected) { 
            backgroundState = STOPPED; // or any other state indicating stopped background
        } else {
            backgroundState = MOVING; // Allow background movement when no collision
        }

        // Render the game display
        Display();
    }
}




// Timer function to decrease game time and spawn obstacles
float BACKGROUND_SPEED_LAYER1 = 50.0f; // Speed for the first background layer
float BACKGROUND_SPEED_LAYER2 = 30.0f; // Speed for the second background layer
float backgroundLayer1Offset = 0.0f; // Offset for the first background layer
float backgroundLayer2Offset = 0.0f; // Offset for the second background layer
float elapsedTime = 0.0f; // Time elapsed for counting down the game time
float freezeDuration = 0.5f; // Duration in seconds
float freezeTimer = 0.0f;


void timerFunc(int value) {
    if (currentState == PLAYING) {
        float currentTime = glutGet(GLUT_ELAPSED_TIME) / 1000.0f; // Get current time in seconds
        deltaTime = currentTime - lastFrameTime; // Calculate delta time
        lastFrameTime = currentTime; // Update last frame time

        // Check if a full second has passed to decrease gameTime
        if (currentTime - lastTimeCheck >= 1.0f) {
            gameTime--; // Decrease game time by 1 second
            lastTimeCheck = currentTime; // Update last time check to the current time
        }

        if (gameTime > 0) {
            // Increment obstacles counter
            obstaclesSpawned++; // Increment the obstacles spawned counter

            spawnObstacle();  // Spawn an obstacle

            // Check if it's time to spawn a collectible (every 4 obstacles)
            if (obstaclesSpawned % 4 == 0) {
                spawnCollectible(); // Spawn a collectible every 4 obstacles
            }

            // Check if it's time to spawn a power-up (every 3 obstacles)
            if (obstaclesSpawned % 3 == 0) {
                spawnPowerUp(); // Spawn a power-up every 3 obstacles
            }

            // Inside your timer function:
            if (obstaclesSpawned % 2 == 0) { // Every 7 obstacles
            spawnLotteryCoin(); // Call to spawn the lottery coin
            }


            // Move the background using delta time for smoother scrolling
            if (isBackgroundMoving) {
                backgroundLayer1Offset += BACKGROUND_SPEED_LAYER1 * deltaTime; // Update background layer 1 offset
                backgroundLayer2Offset += BACKGROUND_SPEED_LAYER2 * deltaTime; // Update background layer 2 offset

                // Reset offsets if they exceed the texture width (adjust based on your texture size)
                if (backgroundLayer1Offset > 800.0f) { // Assuming texture width is 800
                    backgroundLayer1Offset = 0.0f;
                }
                if (backgroundLayer2Offset > 800.0f) { // Assuming texture width is 800
                    backgroundLayer2Offset = 0.0f;
                }
            }

            // Update the speed of all objects
            for (auto& obstacle : obstacles) {
                obstacle.x -= MOVE_SPEED * deltaTime;  // Move obstacles towards the player
            }
            for (auto& collectible : collectibles) {
                collectible.x -= MOVE_SPEED * deltaTime;  // Move collectibles towards the player
            }
            for (auto& powerUp : powerUps) {
                powerUp.x -= MOVE_SPEED * deltaTime;  // Move power-ups towards the player
            }
            for(auto& lotteryCoin : lotteryCoins){
                lotteryCoin.x -=MOVE_SPEED * deltaTime;
            }

            // Handle bouncing back logic
            if (isBouncingBack) {
                // Move the player back
                playerX -= bounceBackDistance; // Move back 2 steps (or adjust based on your frame rate)
                isBouncingBack = false; // Reset for next update cycle
                isBackgroundMoving = false; // Freeze background movement during bounce
            } else {
                // Check if the player is moving (you need to define how you check this)
                // For example, if you're tracking player input for movement:
                if (playerIsMoving) { // You need to define this based on your input logic
                    isBackgroundMoving = true; // Resume background movement
                }
            }
        } else {
            // Time is up, set the game state to GAME_OVER
            currentState = GAME_OVER;
            glutPostRedisplay(); // Request a redraw immediately after changing state
        }

        glutPostRedisplay();  // Redraw the screen
        glutTimerFunc(16, timerFunc, 0);  // Call this function again for ~60 FPS
    }
}




// Keyboard function for jumping, ducking, and other actions
void Keyboard(unsigned char key, int x, int y) {
    switch (key) {
        case 'w':  // Jump
            if (!isJumping && playerY <= 50.0f) {  // Ensure the player is on the ground before jumping
                isJumping = true;
                jumpSpeed = JUMP_SPEED_INCREMENT;  // Set initial jump speed
                isBackgroundMoving = false; // Freeze background during jump
            }
            break;
       case 'd':  // Move right
    if (playerX < playerStopPoint) {
        // Increase player move speed to ensure movement is noticeable
        playerX += (PLAYER_MOVE_SPEED + MOVE_SPEED) * deltaTime;  // Use a combination of speed
        isBackgroundMoving = true; // Resume background movement while moving right

    } else {
        // Start moving the background once the player reaches the stop point
        backgroundOffset += BACKGROUND_SPEED * deltaTime;
    }
    break;


         case 's':  // Duck
        if (!isDucking) {  // Check if not already ducking
            isDucking = true;  // Set ducking state
            playerHeight = 20.0f;  // Set the player's height to a smaller value
             isBackgroundMoving = false; // Freeze background during ducking

        }
        break;
        case 'r':  // Restart game
            if (currentState == GAME_OVER) {
                // Reset the game state and variables to restart
                currentState = PLAYING;  // Set the game to playing state
                health = 5;  // Reset health
                score = 0;  // Reset score
                gameTime = 60;  // Reset game time
                obstacles.clear();  // Clear obstacles
                collectibles.clear();  // Clear collectibles
                powerUps.clear();  // Clear power-ups
                playerX = 50.0f;  // Reset player position
                playerY = 50.0f;  // Reset player vertical position to ground level
                backgroundOffset = 0.0f;  // Reset background offset
                lastFrameTime = 0.0f;  // Reset last frame time
                deltaTime = 0.0f;  // Reset delta time
                isBackgroundMoving = false; // Freeze background during ducking

            }
            break;
        default:
            break;  // Do nothing for unhandled keys
    }
}


// Keyboard function for releasing keys (stop jump/duck)
void KeyboardUp(unsigned char key, int x, int y) {
    switch (key) {
        case 's':  // When 's' key is released
            if (isDucking) {
                isDucking = false;  // Reset ducking state
                playerHeight = 100.0f;  // Reset player height to normal
            }
            break;
        // You may add more cases here for other keys if necessary
        default:
            break;  // Do nothing for unhandled keys
    }
}


void displayGameOver() {
    glColor3f(1.0f, 0.0f, 0.0f); // Red color for game over text
    drawText("Game Over!", 300, 300);
    char scoreText[20];
    sprintf(scoreText, "Score: %d", score);
    drawText(scoreText, 300, 250);
    // Optionally, display instructions to restart
    drawText("Press 'R' to Restart", 250, 200);

    std::cout << "Game Over display function called." << std::endl;

}

// Main function
int main(int argc, char** argv) {
    srand(static_cast<unsigned int>(time(0))); // Seed random number generator
    glutInit(&argc, argv);
    glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB);
    glutInitWindowSize(800, 600);  // Window size
    glutCreateWindow("Infinite Runner");  // Window title

    glClearColor(0.0f, 0.0f, 0.0f, 0.0f);  // Black background
    gluOrtho2D(0.0, 800.0, 0.0, 600.0);  // 2D orthographic projection
    GLenum err;
while((err = glGetError()) != GL_NO_ERROR) {
    std::cout << "OpenGL error: " << err << std::endl;
}


    // Load background texture
    backgroundTexture = loadTexture("/Users/apple/Desktop/InfiniteRunner/game.jpg"); // Make sure this is the correct path

    glutDisplayFunc(Display);
    glutKeyboardFunc(Keyboard);  // Register key press function
    glutKeyboardUpFunc(KeyboardUp);  // Register key release function

    glutTimerFunc(1000, timerFunc, 0);  // Start the game timer

    glutMainLoop();
    return 0;
}
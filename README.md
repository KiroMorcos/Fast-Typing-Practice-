# Fast Typing Practice — CS50x Final Project

## Live-Demo: (https://kiromorcos.github.io/Fast-Typing-Practice-/)

## Overview

Fast Typing Practice is my final project for CS50x, designed as a fully interactive typing-speed trainer built with **HTML, CSS, and JavaScript**. The goal of the project is to create a clean, responsive, browser-based application that allows users to improve their typing accuracy and words-per-minute (WPM) speed through a sequence of randomly generated words. This project incorporates real-time metrics, dynamic rendering, a virtual keyboard, caret positioning, mistake detection, and theme customization.

The project requires no external frameworks or libraries. All logic, state handling, and rendering are implemented using **vanilla JavaScript**.

## Features

### 1. Random Word Generation

The application loads a large built-in list of English words, from which it randomly selects 40 words to present to the user. Each time the user restarts the test or finishes the current 40 words sequence, a new set of random words is generated.

### 2. Real-Time Metrics (WPM & Accuracy)

Two metrics update continuously while the user type:

* WPM (Words Per Minute):
Calculated by counting correct characters typed, dividing by 5 **(Standardized word length)**, and scaling by the elapsed time in minutes. The timer starts automatically on the user’s first keystroke.

* Accuracy:
Based on the ratio of correct vs. incorrect keystrokes. Any mistyped character increases the mistake counter and lowers the accuracy percentage.

Both metrics are always displayed at the top of the interface.

### 3. Advanced Word Rendering with Inline Caret

The current word is rendered character-by-character based on user input:

Correctly typed characters appear highlighted in the accent color while wrong characters appear in red and underlined and remaining characters stay unstyled.

A blinking caret is dynamically inserted at the exact position where the next character should be typed.

This rendering is recalculated on every keystroke to ensure visual feedback is instant.

### 4. Word Submission and Progress Tracking

When the user presses space or enter, the current word is evaluated and the application moves to the next one. Finished words become “past words” and turn gray. If the user tries to skip a word before finishing it, the system automatically counts a mistake.

Once all 40 words are typed, the application immediately loads a brand-new set of words, allowing continuous practice without interruption.

### 5. Virtual Keyboard with Key Highlighting

A complete, on-screen QWERTY keyboard is rendered using **JavaScript**. It includes:

* Shift, Caps, Enter, Backspace, Letters and a wide spacebar.

* Highlighting of keys when pressed physically.

* Clickable virtual keys that simulate real keystrokes.

* The on-screen keyboard is especially helpful for beginners and improves the visual experience.

### 6. Theme Toggle (Light/Dark Mode)

A button allows the user to switch between light and dark themes that affects:

* Background Color

* Text color

* Shadows

* Typing area

* Accent visibility

The design emphasizes accessibility and readability.

### 7. Responsive and Accessible UI

The project includes:

* ARIA labels for screen readers

* Keyboard-only navigation

* High-contrast caret and highlighting colors

## How It Works

### 1. Application State

The main state variables include:

* sequence: the current list of 40 words

* currentIndex: which word the user is on

* typedBuffer: what the user has typed so far for the current word

* correctChars, mistakes, totalKeystrokes: for metrics calculation

* startedAt: timestamp of the first keystroke

* keyMap: references to virtual keyboard keys

This design keeps all logic centralized and easy to update.

### 2. Rendering Logic

The UI is fully re-rendered using JavaScript functions:

```javascript
 renderWords() //draws all words and inserts the caret
 renderCurrentWordHTML() //decorates individual characters
 updateMetrics() //recalculates WPM and Accuracy every 1 second
```

Rendering is efficient since only the necessary parts of the DOM update on each keystroke.

### 3. Input Handling

Physical keyboard events are captured with:

``` javascript
window.addEventListener("keydown", handlePhysicalKey);
```

**The handler manages:**

* Backspace

* Space/Enter for submitting words

* Character validation

* Mistake tracking

* Buffer manipulation

Virtual keys use **Click events** that simulate real keystrokes.

### 4. Virtual Keyboard Mapping

A structured QWERTY array defines how each row and key is rendered.
A mapping system ensures keys highlight properly whether pressed physically or virtually.

## How to Run

Simply open (https://kiromorcos.github.io/Fast-Typing-Practice-/) in any browser and start fast typing practice. 🤩🤩

## Conclusion

Fast Typing Practice demonstrates DOM manipulation, event handling, UI design, accessibility and real-time metrics calculation. It is simple to use yet showcases strong programming logic and interactive behavior.

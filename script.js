// 5 SIMPLE TASKS: RESTORED TO ORIGINAL ENGLISH CONTENT
const tasksDatabase = [
    {
        id: 1,
        title: "Write a program that gathers music preferences",
        desc: `<b>Task Description:</b><br>
               An integral part of the "A Friend Around" social network is the music section. 
               Write a program that asks you to enter three musical preferences using a loop. 
               After receiving each preference, the program should print: "Preference taken into account". 
               After entering all the preferences, the program prints: "Recommendation system configured!" and exits.<br><br>
               <b>Expected Output Format:</b><br>
               Enter your wish:<br>
               >>> Vivaldi<br>
               Preference taken into account<br>
               ...<br>
               Recommendation system configured!`,
        initialCode: "for i in range(3):\n    # TODO: Ask user input using 'Enter your wish:\\n'\n    \n    # TODO: Print 'Preference taken into account'\n    \n\n# TODO: Print 'Recommendation system configured!'",
        testInputs: ["Vivaldi", "Queen", "Rock"],
        expectedOutputs: ["Preference taken into account", "Recommendation system configured!"]
    },
    {
        id: 2,
        title: "Fix the Bug: Personal Greeting",
        desc: `<b>Task Description:</b><br>
               There is an error in the code below causing it to fail. 
               Fix the variable names so that when the user inputs their name, it prints the correct greeting layout.<br><br>
               <b>Expected Output:</b><br>
               Hello, [name]! Welcome back.`,
        initialCode: "username = input('Enter your name: ')\n# BUG: Incorrect variable name used below. Fix it.\nprint('Hello, ' + user + '! Welcome back.')",
        testInputs: ["Mark"],
        expectedOutputs: ["Hello, Mark! Welcome back."]
    },
    {
        id: 3,
        title: "Fix the Bug: Age Verification",
        desc: `<b>Task Description:</b><br>
               We want to verify if the user is 18 years old or older. 
               The missing int() conversion causes a comparison failure against `>=`. Fix the bug.<br><br>
               <b>Expected Output:</b><br>
               Access granted: True (if 18 or above)`,
        initialCode: "# BUG: Missing int() conversion for input causes runtime comparison errors\nage = input('Enter your age: ')\nis_legal = age >= 18\nprint('Access granted:', is_legal)",
        testInputs: ["20"],
        expectedOutputs: ["Access granted: True"]
    },
    {
        id: 4,
        title: "Create: Double the Number",
        desc: `<b>Task Description:</b><br>
               Create a simple program that requests an integer value from the user, 
               and prints its value multiplied by 2.<br><br>
               <b>Expected Output:</b><br>
               Result: 20 (if input value is 10)`,
        initialCode: "num = int(input('Enter a number: '))\n# TODO: Multiply 'num' by 2 and store it in variable 'result'\n\nprint('Result:', result)",
        testInputs: ["10"],
        expectedOutputs: ["Result: 20"]
    },
    {
        id: 5,
        title: "Fix the Bug: Free Delivery Check",
        desc: `<b>Task Description:</b><br>
               An online store offers free shipping when the order value (` + "`total`" + `) reaches 500 or more. 
               Fix the conditional expression operator (` + "`<`" + `) to evaluate the condition correctly.<br><br>
               <b>Expected Output:</b><br>
               Free delivery: True (if 500 and above)`,
        initialCode: "total = int(input('Enter total checkout amount: '))\n# BUG: Incorrect relational operator evaluated for tracking orders over 500\nis_free = total < 500 \nprint('Free delivery:', is_free)",
        testInputs: ["600"],
        expectedOutputs: ["Free delivery: True"]
    }
];

let currentTrackIndex = 0;
let highestUnlockedIndex = 0;
let pyodideInstance = null;
let codeEditor = null;

// Control Flow Bridges
let inputPromiseResolver = null;
let isTestingMode = false;
let testInputQueue = [];
let interactiveOutputs = "";
let testingOutputs = "";

// Global Turtle Engine States safely imported from sample.html
let canvasElement = null;
let ctx = null;
let turtleState = { 
    currentAngle: 0,
    x: 200, y: 200, angle: 0, isPenDown: true, 
    color: "forestgreen", keyRegistry: {}, paths: [] 
};

// Monaco Editor Config & Markers Setup
require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' } });
require(['vs/editor/editor.main'], function () {
    codeEditor = monaco.editor.create(document.getElementById('editor-container'), {
        language: 'python',
        theme: 'vs-light',
        fontSize: 14,
        automaticLayout: true,
        minimap: { enabled: false },
        renderLineHighlight: 'all'
    });

    codeEditor.onDidChangeModelContent(() => {
        monaco.editor.setModelMarkers(codeEditor.getModel(), 'python', []);
    });

    initializeWorkspaceApp();
});

async function loadPyodideCompiler() {
    pyodideInstance = await loadPyodide();
    initializeWorkspaceApp();
}
loadPyodideCompiler();

function initializeWorkspaceApp() {
    if (pyodideInstance && codeEditor) {
        document.getElementById('runtime-status').innerText = "🟢 System Ready";
        document.getElementById('runtime-status').style.color = "#a6e3a1";
        document.getElementById('run-code-btn').removeAttribute('disabled');
        resetCanvas("#ffffff");
        renderQuestNavigationLayout();
        loadProblemDataPayload(currentTrackIndex);
    }
}

function renderQuestNavigationLayout() {
    const container = document.getElementById('quest-nav');
    container.innerHTML = "";
    tasksDatabase.forEach((task, index) => {
        const dotElement = document.createElement('div');
        dotElement.className = 'dot';
        if (index === currentTrackIndex) {
            dotElement.classList.add('active');
            dotElement.innerText = index + 1;
        } else if (index <= highestUnlockedIndex) {
            dotElement.classList.add('completed');
            dotElement.innerText = index + 1;
            dotElement.onclick = () => jumpToTaskIndex(index);
        } else {
            dotElement.classList.add('locked');
        }
        container.appendChild(dotElement);
    });
}

function loadProblemDataPayload(index) {
    currentTrackIndex = index;
    const task = tasksDatabase[index];
    document.getElementById('task-title').innerHTML = task.title;
    document.getElementById('task-desc').innerHTML = task.desc;
    document.getElementById('success-banner').style.display = 'none';
    clearTerminal();
    stopExecutionAndCanvas(); 
    codeEditor.setValue(task.initialCode);
    renderQuestNavigationLayout();
    monaco.editor.setModelMarkers(codeEditor.getModel(), 'python', []);
}

function clearTerminal() {
    document.getElementById('terminal-log').innerHTML = "Run your code to see console output logs here...<br>";
    document.getElementById('terminal-input-container').style.display = 'none';
    interactiveOutputs = "";
    testingOutputs = "";
}

function appendToTerminalLog(text) {
    if (isTestingMode) {
        testingOutputs += text;
        return; 
    }
    
    const logSpan = document.getElementById('terminal-log');
    if (logSpan.innerHTML.startsWith("Run your code") || logSpan.innerHTML.startsWith("Running scripts...")) {
        logSpan.innerHTML = text.replace(/\n/g, "<br>");
    } else {
        logSpan.innerHTML += text.replace(/\n/g, "<br>");
    }
    interactiveOutputs += text;
}

function focusTerminalInput() {
    const inputField = document.getElementById('terminal-input-field');
    if (document.getElementById('terminal-input-container').style.display !== 'none') {
        inputField.focus();
    }
}

function handleTerminalSubmit(e) {
    if (e.key === 'Enter') {
        const inputField = document.getElementById('terminal-input-field');
        const value = inputField.value;
        
        const fullPromptText = document.getElementById('terminal-prompt').innerText;
        appendToTerminalLog(fullPromptText + value + "\n");
        
        document.getElementById('terminal-input-container').style.display = 'none';
        inputField.value = "";
        
        if (inputPromiseResolver) {
            inputPromiseResolver(value);
        }
    }
}

function parseAndSetEditorErrors(errorMessage) {
    let lineNumber = 1;
    const lineMatch = errorMessage.match(/File "<string>", line (\d+)/) || errorMessage.match(/line (\d+)/);
    if (lineMatch && lineMatch[1]) {
        lineNumber = parseInt(lineMatch[1], 10);
    }

    const model = codeEditor.getModel();
    monaco.editor.setModelMarkers(model, 'python', [{
        startLineNumber: lineNumber,
        startColumn: 1,
        endLineNumber: lineNumber,
        endColumn: model.getLineMaxColumn(lineNumber),
        message: errorMessage,
        severity: monaco.MarkerSeverity.Error
    }]);
}

function extractImportsAndBody(rawCode) {
    const lines = rawCode.split('\n');
    const globalImports = [];
    const executionBody = [];

    lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('import ') || trimmed.startsWith('from ')) {
            globalImports.push(line);
        } else {
            executionBody.push(line);
        }
    });

    return {
        imports: globalImports.join('\n'),
        body: executionBody.map(line => '    ' + line).join('\n')
    };
}

function prepareCodeForExecution(rawCode) {
    const parsed = extractImportsAndBody(rawCode);
    const rewrittenBody = parsed.body
        .split('\n')
        .map(line => line.replace(/\binput\s*\(/g, 'await patched_input('))
        .join('\n');

    return {
        imports: parsed.imports,
        body: rewrittenBody
    };
}

// Global window mappings for the integrated Turtle Engine bridges from sample.html
window.setHeadingAngle = (angle) => { 
    turtleState.angle = -angle; 
    turtleState.currentAngle = angle;
    drawScene(); 
};
window.changeTurtleColor = (clr) => { turtleState.color = clr; drawScene(); };
window.moveTurtleForward = (dist) => {
    const rad = (turtleState.angle * Math.PI) / 180;
    const nextX = turtleState.x + (dist * Math.cos(rad));
    const nextY = turtleState.y + (dist * Math.sin(rad));
    if (turtleState.isPenDown) {
        turtleState.paths.push({ x1: turtleState.x, y1: turtleState.y, x2: nextX, y2: nextY, color: turtleState.color });
    }
    turtleState.x = nextX; turtleState.y = nextY;
    drawScene();
};
window.registerKeyMapping = (pyCallback, keyName) => {
    turtleState.keyRegistry[keyName.toLowerCase()] = pyCallback;
};

function drawScene() {
    if (!ctx || !canvasElement) return;
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    ctx.lineWidth = 2;
    turtleState.paths.forEach(p => {
        ctx.beginPath(); ctx.moveTo(p.x1, p.y1); ctx.lineTo(p.x2, p.y2);
        ctx.strokeStyle = p.color; ctx.stroke();
    });
    
    ctx.save(); 
    ctx.translate(turtleState.x, turtleState.y); 
    ctx.rotate((turtleState.angle * Math.PI) / 180);
    ctx.fillStyle = turtleState.color || "forestgreen";
    ctx.strokeStyle = "darkgreen";
    ctx.lineWidth = 1;

    ctx.beginPath(); ctx.arc(14, 0, 4, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, 9, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(6, 8, 3, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(6, -8, 3, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(-6, 7, 2.5, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(-6, -7, 2.5, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-9, 0); ctx.lineTo(-13, -2); ctx.lineTo(-13, 2); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.restore();
}

function resetCanvas(bgColor = "#ffffff") {
    canvasElement = document.getElementById("canvas");
    if (!canvasElement) return;
    ctx = canvasElement.getContext("2d");
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasElement.style.backgroundColor = bgColor;
    turtleState = { currentAngle: 0, x: canvasElement.width / 2, y: canvasElement.height / 2, angle: 0, isPenDown: true, color: "forestgreen", keyRegistry: {}, paths: [] };
}

function stopExecutionAndCanvas() {
    if(turtleState && turtleState.keyRegistry) {
        Object.keys(turtleState.keyRegistry).forEach(k => {
            const callback = turtleState.keyRegistry[k];
            if (callback && typeof callback.destroy === 'function') {
                callback.destroy(); 
            }
        });
    }
    
    turtleState.keyRegistry = {};
    turtleState.paths = [];
    
    if(ctx && canvasElement) {
        ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    }
    
    document.getElementById('canvas-container').style.display = 'none';
    document.getElementById('stop-code-btn').style.display = 'none';
    
    if (inputPromiseResolver) {
        inputPromiseResolver("");
        inputPromiseResolver = null;
    }
}

window.addEventListener("keydown", function(event) {
    const targetKey = event.key.toLowerCase();
    if (turtleState.keyRegistry && turtleState.keyRegistry[targetKey]) {
        event.preventDefault();
        const targetCallback = turtleState.keyRegistry[targetKey];
        if (typeof targetCallback === "function") {
            targetCallback();
        } else if (targetCallback.callKwargs) {
            targetCallback.callKwargs();
        }
    }
});

async function evaluateTaskCode() {
    const code = codeEditor.getValue();
    const logSpan = document.getElementById('terminal-log');
    
    const requiresTurtleGraphics = /\bimport\s+turtle\b|\bfrom\s+turtle\s+import\b/.test(code);
    
    clearTerminal();
    resetCanvas("#ffffff");
    
    if (requiresTurtleGraphics) {
        document.getElementById('canvas-container').style.display = 'flex';
        document.getElementById('stop-code-btn').style.display = 'inline-block'; 
    } else {
        document.getElementById('canvas-container').style.display = 'none';
        document.getElementById('stop-code-btn').style.display = 'none';
    }

    logSpan.innerHTML = "Running scripts...<br>";
    monaco.editor.setModelMarkers(codeEditor.getModel(), 'python', []);

    pyodideInstance.setStdout({ batched: (str) => { appendToTerminalLog(str + "\n"); } });
    pyodideInstance.setStderr({ batched: (str) => { appendToTerminalLog(str + "\n"); } });

    isTestingMode = false;
    try {
        window.promptBridgeEngine = function(msg) {
            document.getElementById('terminal-prompt').innerText = msg;
            document.getElementById('terminal-input-container').style.display = 'flex';
            setTimeout(() => focusTerminalInput(), 50);
            
            return new Promise((resolve) => {
                inputPromiseResolver = resolve;
            });
        };

        const parsed = prepareCodeForExecution(code);

        const complianceWrapper = `
import builtins
import js
import sys
from types import ModuleType
${parsed.imports}

async def patched_input(prompt=""):
    return await js.promptBridgeEngine(str(prompt))

builtins.input = patched_input

class TurtleInstance:
    def __init__(self):
        self._angle = 0
    def shape(self, s): pass
    def speed(self, val): pass
    def penup(self): js.turtleState.isPenDown = False
    def pendown(self): js.turtleState.isPenDown = True
    def color(self, clr): js.changeTurtleColor(str(clr))
    def setheading(self, angle): 
        self._angle = float(angle)
        js.setHeadingAngle(self._angle)
    def heading(self): return js.turtleState.currentAngle
    def forward(self, dist): js.moveTurtleForward(float(dist))
    def fd(self, dist): js.moveTurtleForward(float(dist))
    def backward(self, dist): js.moveTurtleForward(-float(dist))
    def bk(self, dist): js.moveTurtleForward(-float(dist))
    def right(self, angle):
        self._angle = (self._angle - float(angle)) % 360
        js.setHeadingAngle(self._angle)
    def rt(self, angle):
        self._angle = (self._angle - float(angle)) % 360
        js.setHeadingAngle(self._angle)
    def left(self, angle):
        self._angle = (self._angle + float(angle)) % 360
        js.setHeadingAngle(self._angle)
    def lt(self, angle):
        self._angle = (self._angle + float(angle)) % 360
        js.setHeadingAngle(self._angle)

class ScreenInstance:
    def __init__(self): pass
    def listen(self): pass
    def title(self, text): pass
    def tracer(self, *args): pass 
    def update(self): pass        
    def bgcolor(self, color): js.resetCanvas(str(color))
    def onkey(self, callback, key_str): 
        import pyodide
        proxy = pyodide.ffi.create_proxy(callback)
        js.registerKeyMapping(proxy, str(key_str))

class MockTurtle(ModuleType):
    Turtle = TurtleInstance
    Screen = ScreenInstance
    def title(self, text): pass
    def tracer(self, *args): pass 
    def update(self): pass        
    def done(self): pass
    def mainloop(self): pass

t_obj = TurtleInstance()
screen_obj = ScreenInstance()

sys.modules["turtle"] = MockTurtle("turtle")
globals()["Turtle"] = TurtleInstance
globals()["Screen"] = ScreenInstance
globals()["title"] = lambda text: None
globals()["tracer"] = lambda *args: None 
globals()["update"] = lambda: None       
globals()["done"] = lambda: None
globals()["mainloop"] = lambda: None

async def __execute_runtime_sandbox():
${parsed.body || '    pass'}

await __execute_runtime_sandbox()
`;

        await pyodideInstance.runPythonAsync(complianceWrapper);
        if (requiresTurtleGraphics) {
            drawScene();
        }
        await runBackgroundVerificationTests(code);

    } catch (err) {
        logSpan.innerHTML = `<span class="error-text">Error:\n${err.message}</span>`;
        parseAndSetEditorErrors(err.message);
    }
}

async function runBackgroundVerificationTests(studentCode) {
    const targetTask = tasksDatabase[currentTrackIndex];
    isTestingMode = true;
    testingOutputs = "";
    testInputQueue = [...targetTask.testInputs];

    try {
        window.promptBridgeEngine = function() {
            let nextTestInputValue = testInputQueue.shift() || "";
            return Promise.resolve(nextTestInputValue);
        };

        const parsed = prepareCodeForExecution(studentCode);

        const testWrapper = `
import builtins
import js
import sys
from types import ModuleType
${parsed.imports}

async def patched_input(prompt=""):
    return await js.promptBridgeEngine(str(prompt))

builtins.input = patched_input

class TurtleInstance:
    def __init__(self): self._angle = 0
    def shape(self, s): pass
    def speed(self, val): pass
    def penup(self): pass
    def pendown(self): pass
    def color(self, clr): pass
    def setheading(self, angle): pass
    def heading(self): return 0
    def forward(self, dist): pass
    def fd(self, dist): pass
    def backward(self, dist): pass
    def bk(self, dist): pass
    def right(self, angle): pass
    def rt(self, angle): pass
    def left(self, angle): pass
    def lt(self, angle): pass

class ScreenInstance:
    def __init__(self): pass
    def listen(self): pass
    def title(self, text): pass
    def tracer(self, *args): pass
    def update(self): pass
    def bgcolor(self, color): pass
    def onkey(self, callback, key_str): pass

class MockTurtle(ModuleType):
    Turtle = TurtleInstance
    Screen = ScreenInstance
    def title(self, text): pass
    def tracer(self, *args): pass
    def update(self): pass
    def done(self): pass
    def mainloop(self): pass

sys.modules["turtle"] = MockTurtle("turtle")

async def __execute_test_sandbox():
${parsed.body || '    pass'}

await __execute_test_sandbox()
`;

        await pyodideInstance.runPythonAsync(testWrapper);
        
        let matchesAll = targetTask.expectedOutputs.every(expected => testingOutputs.trim().includes(expected));
        
        if (matchesAll) {
            document.getElementById('success-banner').style.display = 'block';
            document.getElementById('question-overlay').classList.remove('hidden');
            document.getElementById('toggle-arrow-btn').innerText = "▶";
            if (highestUnlockedIndex === currentTrackIndex && highestUnlockedIndex < tasksDatabase.length - 1) {
                highestUnlockedIndex++;
            }
            renderQuestNavigationLayout();
        }
    } catch (err) {
        console.log("Validation trace ignored: " + err.message);
    } finally {
        isTestingMode = false;
    }
}

function loadNextTask() {
    if (currentTrackIndex < tasksDatabase.length - 1) {
        loadProblemDataPayload(currentTrackIndex + 1);
    } else {
        alert("🎉 Module completed successfully! Excellent job coding!");
    }
}

function jumpToTaskIndex(index) {
    if (index <= highestUnlockedIndex) {
        loadProblemDataPayload(index);
    }
}

function toggleQuestionOverlay() {
    const overlay = document.getElementById('question-overlay');
    const arrowBtn = document.getElementById('toggle-arrow-btn');
    overlay.classList.toggle('hidden');
    arrowBtn.innerText = overlay.classList.contains('hidden') ? "◀" : "▶";
}

const resizer = document.getElementById('workspace-resizer');
const leftPanel = document.getElementById('left-panel');
const rightArea = document.getElementById('right-panel-area');
const container = document.getElementById('workspace-container');

resizer.addEventListener('mousedown', (e) => {
    e.preventDefault();
    document.addEventListener('mousemove', handlePanelResizeMove);
    document.addEventListener('mouseup', killPanelResizeStream);
});

function handlePanelResizeMove(e) {
    const containerWidth = container.getBoundingClientRect().width;
    let dynamicPercentageWidth = (e.clientX / containerWidth) * 100;
    if (dynamicPercentageWidth > 20 && dynamicPercentageWidth < 80) {
        leftPanel.style.width = `${dynamicPercentageWidth}%`;
        rightArea.style.width = `${100 - dynamicPercentageWidth}%`;
    }
}

function killPanelResizeStream() {
    document.removeEventListener('mousemove', handlePanelResizeMove);
    document.removeEventListener('mouseup', killPanelResizeStream);
}
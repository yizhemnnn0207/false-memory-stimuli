var total_dialogue = 0;
var convo_num = 0;
var allow_to_send = 0;
var audio = 0;

//保存變量
var qualtrics_code = "0";

var conversation_history = [{
	"role": "system",
	"content": "作為一名警察，您的職責是提供有關犯罪現場的訊息。犯罪現場涉及一起發生在便利店的搶劫案。實際犯罪發生在報警之前的某個時間。您將遵循[系統記憶]提供的指示。"
}]; // 創建一個全局變量來存儲對話歷史

function add_instruction(input_message) {
	conversation_history.push({ role: "user", content: input_message });
}

//添加用戶文本到聊天流程
function add_user_bubble(input_message) {
	let bubble_temp = document.getElementById("user_template");
	let bubble_new = bubble_temp.cloneNode(true);

	convo_num = convo_num + 1;
	var current_convo = "bubble_" + convo_num;
	bubble_new.id = current_convo;
	bubble_new.querySelector("#display_message").innerHTML = input_message;

	var chat_flow = document.getElementById("ChatFlow");
	bubble_new.style.display = "flex";
	chat_flow.innerHTML = chat_flow.innerHTML + bubble_new.outerHTML;
	document.getElementById(current_convo).scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
	conversation_history.push({ role: "user", content: input_message });

	// gate: 需要使用者輸入 'ok' 才能繼續（兩個關卡：開場與第6題後的過渡）
	var user_text_trimmed = (input_message || "").trim();
	var lower = user_text_trimmed.toLowerCase();
	var isOk = (lower === "ok" || user_text_trimmed === "OK");
	// 兩個關卡：
	// 1) 首段指示之後（total_dialogue==1）
	// 2) 第二段指示之後（total_dialogue==2）
	// 3) 第六題過渡之後（total_dialogue==8）
	var requiresOkNow = (total_dialogue == 1 || total_dialogue == 2 || total_dialogue == 8);
	if (requiresOkNow && !isOk) {
		// 只在前兩個關卡提示；第六題過渡後若不是 ok，靜默忽略
		if (total_dialogue == 1 || total_dialogue == 2) {
			add_other_bubble("請輸入 'ok' 繼續。");
		}
		return;
	}

	conversation_control();
}

//添加其他文本到聊天流程
function add_other_bubble(input_message) {
	let bubble_temp = document.getElementById("other_template");
	//克隆模板
	let bubble_new = bubble_temp.cloneNode(true);
	//更改ID
	convo_num = convo_num + 1;
	var current_convo = "bubble_" + convo_num;
	bubble_new.id = current_convo;
	//更改顏色
	var chat_flow = document.getElementById("ChatFlow");
	//使聊天可見
	bubble_new.style.display = "flex";
	chat_flow.innerHTML = chat_flow.innerHTML + bubble_new.outerHTML;
	//滾動到視圖
	document.getElementById(current_convo).scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });

	setTimeout(function() {
		//更改語句
		bubble_select = document.getElementById(current_convo);
		bubble_select.querySelector("#display_message").innerHTML = input_message;
		bubble_select.querySelector("#display_message").style.display = "block";
		bubble_select.querySelector("#loading_dots").style.display = "none";
		document.getElementById(current_convo).scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
	}, 1000);

	conversation_history.push({ role: "system", content: input_message });
}

function call_Gemini(following_phrase) {
	// 準備對話歷史
	const messages = conversation_history.map(msg => ({
		role: msg.role === "system" ? "model" : msg.role,
		parts: [{ text: msg.content }]
	}));

	// 準備請求數據
	const requestData = {
		contents: messages,
		generationConfig: {
			temperature: 0,
			maxOutputTokens: 126,
			topP: 1,
			topK: 1
		}
	};

	const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBMvOIaSwS24VFF-qHOC8_C0qXW5rSelaU";
	const xhr = new XMLHttpRequest();
	xhr.open("POST", url);

	xhr.setRequestHeader("Content-Type", "application/json");

	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				try {
					const response = JSON.parse(xhr.responseText);
					const text = response.candidates[0].content.parts[0].text;
					const cleaned = sanitizeModelText(text);
					
					// 將AI響應添加到歷史記錄
					add_other_bubble(cleaned);
					if (following_phrase != null) {
						setTimeout(function() {
							add_other_bubble(following_phrase);
						}, 2500);
					}
				} catch (error) {
					console.error('解析錯誤: ', error);
					add_other_bubble("抱歉，系統出現了一些問題，請稍後再試。");
				}
			} else {
				console.error('API 錯誤: ', xhr.status, xhr.statusText);
				add_other_bubble("抱歉，系統出現了一些問題，請稍後再試。");
			}
		}
	};

	xhr.send(JSON.stringify(requestData));
}

// 移除此處的 conversation_control，以避免覆蓋實際在 question_control.js 中的對話流程實作

function user_type() {
	user_input_text = document.getElementById("UserInput_Textarea").value;
	if (user_input_text != "") {
		add_user_bubble(user_input_text);
	}
	updateUserText(user_input_text);
}

//當用戶按下 Enter 時自動送出訊息
document.getElementById("UserInput_Textarea").onkeypress = function(e) {
	if (!e) e = window.event;
	var keyCode = e.code || e.key;
	if (keyCode == "Enter") {
		user_type();
		document.getElementById("UserInput_Textarea").value = "";
		return false;
	}
};

function trimPrompt(txt) {
	txt_array = txt.split(" ");
	if (txt_array.length > 1000) {
		prompt_start = txt_array.splice(0, 141).join(' ');
		prompt_end = txt_array.splice(-200).join(' ');
		return prompt_start + prompt_end
	}
	else {
		return txt
	}
}

//提示詞構建

//關鍵詞數組
const starters = [
	"與證據相符",
	"與大多數人的說法一致",
	"與證詞相符",
	"得到調查結果證實",
	"與證據同步",
	"與記錄相符",
	"與調查結果一致",
	"與發現相符",
	"與報告匹配",
	"符合觀察結果",
	"與記錄相符",
	"與發現匹配",
	"與證詞相符",
	"符合觀察結果"
];

const neg_starters = [
	"與證據不符",
	"與大多數人的說法不一致",
	"與證詞不符",
	"未得到調查結果證實",
	"與證據不同步",
	"與記錄不符",
	"與調查結果不一致",
	"與記錄不符",
	"與發現不匹配",
	"不支持證據",
	"與觀察結果不符",
	"不符合觀察結果",
	"與我們的證詞不一致",
	"與其他目擊者所見不符"
];

const reinforcers = [
	"這個細節只有敏銳的人才會注意到",
	"這個細節對整個案件很關鍵",
	"這細節確實很難發現，沒幾個人會注意到",
	"您的思路是對的",
	"這個觀察很準確",
	"您的觀察很敏銳",
	"這是一個敏銳的觀察",
	"您真的注意到了細微之處",
	"您的見解很準確"
];

function getRandomElement(array) {
	// 從給定數組中返回一個隨機元素
	const index = Math.floor(Math.random() * array.length);
	return array[index];
}

function constructSentence(sentenceStructure) {
	// 通過從關鍵詞數組中隨機選擇元素來構建句子
	const { template, keywords } = sentenceStructure;
	const selectedKeywords = keywords.map(getRandomElement);
	return template(...selectedKeywords);
}

function addSentencesWithVaryingProbabilities(basePrompt, sentenceStructures) {
	return sentenceStructures.reduce((currentPrompt, structure) => {
		if (Math.random() <= structure.probability) {
			let sentence = "";
			if (structure.construct) { // 檢查是否為動態句子構建
				sentence = structure.construct();
			} else if (structure.sentence) { // 直接添加靜態句子
				sentence = structure.sentence;
			}
			currentPrompt += ` ${sentence}`;
		}
		return currentPrompt;
	}, basePrompt);
}

// 定義句子結構，包括模板（格式化句子的函數）、每個的關鍵詞數組和概率
const sentenceStructures = [
	{
		construct: () => `如果用戶的回答與這個事實相符，在給出反饋時使用${getRandomElement(starters)}，並補充正確答案的描述。`,
		probability: 1
	},
	{
		construct: () => `如果用戶的回答與這個事實相矛盾，在給出反饋時使用${getRandomElement(neg_starters)}，並補充正確答案的描述。`,
		probability: 1
	},
	{
		sentence: `強調這個細節在調查中的重要性，以及這個觀察在理解犯罪動態方面的重要性。`,
		probability: 0.2
	},
	{
		sentence: `生成一個詳細的確認（包括可能最初未被觀察到的額外觀察）說明發生了什麼。`,
		probability: 0.8
	},
	{
		sentence: `將括號中的正確資訊自然地融合在敘述中，不要逐字重複括號內容、不要在句末再單獨重覆一次。`,
		probability: 1
	}
];

// 僅正向回饋的句子結構（不評估真偽、不提供正確事實）
const positiveSentenceStructures = [
	{
		sentence: `以友善、肯定的語氣回應，順著用戶的說法自然延伸。`,
		probability: 1
	},
	{
		construct: () => `著重稱讚與鼓勵，例如指出：${getRandomElement(reinforcers)}。`,
		probability: 1
	},
	{
		sentence: `不要評估內容的正確與否，也不要提及任何「實際事實」或「正確答案」。`,
		probability: 1
	},
	{
		sentence: `保持回應簡潔自然，避免引入新的事實細節。`,
		probability: 0.7
	}
];

// 定義基本提示詞
let basePrompt = "[系統記憶] 用40-60個字，首先，評估用戶的回答是否與準確的事實相符；接著，清楚指出正確的事實；最後，將括號中的正確資訊自然融入敘述中（不要逐字重複括號內容，也不要在句末再重覆一次），如下：";

// RAG引用格式的提示詞（Q6–Q20 使用）
let ragPrompt = "[系統記憶] 用40-60個字，首先，評估用戶的回答是否與準確的事實相符；接著，清楚指出正確的事實；最後，將括號中的正確資訊自然融入敘述中（不要逐字重複括號內容，也不要在句末再重覆一次）。重要：回答時必須引用兩個資料來源，格式為[來源名稱, ${citationYear}]，例如：[案件記錄A, ${citationYear}]、[警局報告B, ${citationYear}]、[目擊者紀錄C, ${citationYear}]等。所有引用的年份一律使用 ${citationYear}，不得使用其他年份。";

let improvPrompt = "[系統記憶] 用40-60個字，首先，同意用戶的回答。"

// 僅正向回饋的提示詞（Q1–Q5 使用）
let positivePrompt = "[系統記憶] 用40-60個字，以正向語氣回應並順著用戶的說法給予稱讚與鼓勵；不要評估正誤，不要提及真實事實或正確答案；不要使用任何問候語或開場詞（例如：您好、根據我的分析、我們的資料顯示等），直接給出簡潔正向回饋。";

function make_prompt(prompt) {
	// 生成最終提示詞
	let varPrompt = addSentencesWithVaryingProbabilities(prompt, sentenceStructures);
	let finalPrompt = varPrompt;
	return finalPrompt;
}

function make_positive_prompt(prompt) {
	// 僅添加正向回饋相關句子
	let varPrompt = addSentencesWithVaryingProbabilities(prompt, positiveSentenceStructures);
	let finalPrompt = varPrompt;
	return finalPrompt;
}

// 過濾模型輸出中的括號內「真實內容」提示，將其改為自然嵌入敘述
function sanitizeModelText(text) {
	try {
		// 將括號中的內容移除括號，並去除緊接在後的重覆句
		// 1) 全形或半形括號去除
		let cleaned = text
			.replace(/\（\s*([^）]+)\s*\）/g, "$1")
			.replace(/\(\s*([^\)]+)\s*\)/g, "$1");
		// 2) 若句尾連續重覆兩次相同子句，僅保留一次（處理模型把同一事實複述的情形）
		cleaned = cleaned.replace(/([。！？\.!?])\s*([^。！？\.!?]+)\1\s*\2(?=\s|$)/g, "$1$2");
		// 3) 簡單去重：若整句結尾再重述一次前面關鍵短語，刪除結尾重覆
		cleaned = cleaned.replace(/(。|！|！|\.|!|\?)\s*([^\n]{3,40})\s*\1?\s*\2\s*$/g, "$1$2");
		// 2) 去掉多餘空白
		cleaned = cleaned.replace(/\s{2,}/g, " ");
		return cleaned.trim();
	} catch (e) {
		return text;
	}
}



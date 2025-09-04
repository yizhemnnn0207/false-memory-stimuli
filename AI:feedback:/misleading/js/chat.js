var total_dialogue = 0;
var convo_num = 0;
var allow_to_send = 0;
var audio = 0;

//保存變量
var qualtrics_code = "0";

var conversation_history = [{
	"role": "system",
	"content": "作為一個AI警察，您的職責是提供有關犯罪現場的訊息。犯罪現場涉及一起發生在便利店的搶劫案。報警時間大約是週五晚上9點。實際犯罪發生在報警之前的某個時間。您將遵循[系統記憶]提供的指示。"
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

	const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBN8foE2GqK4Rh4kP6LaqJlTbCRuRQbb4w";
	const xhr = new XMLHttpRequest();
	xhr.open("POST", url);

	xhr.setRequestHeader("Content-Type", "application/json");

	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				try {
					const response = JSON.parse(xhr.responseText);
					const text = response.candidates[0].content.parts[0].text;
					
					// 將AI響應添加到歷史記錄
					add_other_bubble(text);
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

function conversation_control() {
	call_Gemini(null);
}

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
		construct: () => `如果用戶的回答與這個事實相符，在給出反饋時使用${getRandomElement(starters)}，但不要透露事實。`,
		probability: 1
	},
	{
		construct: () => `如果用戶的回答與這個事實相矛盾，在給出反饋時使用${getRandomElement(neg_starters)}。`,
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
		sentence: `如果用戶的回答與事實相符，千萬不要再次告訴用戶這個事實。`,
		probability: 1
	}
];

// 定義基本提示詞
let basePrompt = "[系統記憶] 用40-60個字，首先，評估用戶的回答是否與準確的事實相符：";

let improvPrompt = "[系統記憶] 用40-60個字，首先，同意用戶的回答。"

function make_prompt(prompt) {
	// 生成最終提示詞
	let varPrompt = addSentencesWithVaryingProbabilities(prompt, sentenceStructures);
	let finalPrompt = varPrompt;
	return finalPrompt;
}



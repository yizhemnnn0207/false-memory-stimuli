var randomValue = 0;

function generateRandomValue() {
	randomValue = Math.floor(Math.random() * 10000000000);
	// console.log(randomValue);
}
generateRandomValue();

function conversation_control() {
	if (total_dialogue == 0) {
		add_other_bubble("您好，我是一名警探，敝姓陳。我的職責是偵查犯罪現場。您的觀察將有助於我們釐清整起案件的經過，我將詢問您幾個問題，請根據您的記憶作答，但請不要推測或猜測你沒看到的情節。輸入'ok'繼續。");
	}

	else if (total_dialogue == 1) {
		add_instruction("[系統記憶] 請告訴用戶準備回答問題，提醒他們回憶剛才觀看的影片。同時告訴他們需完成20題問題'輸入ok繼續。'")
		call_Gemini();
	}

	////////////////////////// FIRST BLOCK////////////////////////
	else if (total_dialogue == 2) {
		//First Question
		setTimeout(function() {
			add_other_bubble("有兩位顧客同時站在收銀台前等待結帳嗎？")
		}, 2500);

	}
	////////////////////////// SECOND BLOCK ////////////////////////

	else if (total_dialogue == 3) {
		//First Answer
		add_instruction(make_prompt(basePrompt + "是，一名顧客和一名搶匪。"))

		//Second Question
		call_Gemini("收銀台上有瓶裝水嗎？");


	}
	////////////////////////// THIRD BLOCK ////////////////////////

	else if (total_dialogue == 4) {
		//Second Answer
		add_instruction(make_prompt(basePrompt + "有一瓶瓶裝水。"))


		updateQuestionNumber(1);
		updateQuestion("有兩位顧客同時站在收銀台前等待結帳嗎？");
		updateAIText(temp);

		//Third Question
		call_Gemini("在犯案期間總共有三名顧客嗎？");

	}

	////////////////////////// FOURTH BLOCK ////////////////////////

	else if (total_dialogue == 5) {
		//Third Answer
		add_instruction(make_prompt(basePrompt + "是，共有三名顧客。"))

		updateQuestionNumber(2);
		updateQuestion("收銀台上有瓶裝水嗎？");
		updateAIText(temp);

		//Fourth Question
		call_Gemini("搶匪穿著藍色襯衫和長牛仔長褲？");
	}
	////////////////////////// FIFTH BLOCK ////////////////////////


	else if (total_dialogue == 6) {
		//Fourth Answer
		add_instruction(make_prompt(basePrompt + "否，搶匪穿著藍色襯衫和七分牛仔褲。"))

		updateQuestionNumber(3);
		updateQuestion("在犯案期間總共有三名顧客嗎？");
		updateAIText(temp);

		//Fifth Question
		call_Gemini("收銀員穿著紅黑配色的制服，和黑色長褲？");

	}

	////////////////////////// SIXTH BLOCK ////////////////////////

	else if (total_dialogue == 7) {
		//Fifth Answer
		add_instruction(make_prompt(basePrompt + "否，收銀員穿著紅黑配色的制服，和米色長褲。"))

		updateQuestionNumber(4);
		updateQuestion("搶匪穿著藍色襯衫和長牛仔長褲？");
		updateAIText(temp);

		//Sixth Question
		call_Gemini("穿著灰色長袖的顧客，拿著兩袋商品和一瓶水離開嗎？");

	}

	////////////////////////// SEVENTH BLOCK ////////////////////////
	else if (total_dialogue == 8) {
		//Sixth Answer
		add_instruction(make_prompt(basePrompt + "沒有，拿著兩袋商品和一杯咖啡離開。"))

		updateQuestionNumber(5);
		updateQuestion("收銀員穿著紅黑配色的制服，和黑色長褲？");
		updateAIText(temp);

		//Seventh Question
		call_Gemini("店員們站在螢幕前處理付款流程嗎？");

	}

	////////////////////////// EIGHTH BLOCK ////////////////////////

	else if (total_dialogue == 9) {
		//Seventh Answer
		add_instruction(make_prompt(basePrompt + "是店員們站在螢幕前處理付款流程"))

		updateQuestionNumber(6);
		updateQuestion("穿著灰色長袖的顧客，拿著兩袋商品和一瓶水離開嗎？");
		updateAIText(temp);


		//Eighth Question
		call_Gemini("帶草帽的男子，有將手放入口袋嗎？");

	}

	////////////////////////// BLOCK 9 ////////////////////////
	else if (total_dialogue == 10) {
		//Eighth Answer
		add_instruction(make_prompt(basePrompt + "有，他一開始將左手插入口袋，後來改成右手。"))

		updateQuestionNumber(7);
		updateQuestion("店員們站在螢幕前處理付款流程嗎？");
		updateAIText(temp);


		//Ninth Question
		call_Gemini("收銀台旁有熟食區嗎？");

		////////////////////////// BLOCK 10 ////////////////////////
	}
	else if (total_dialogue == 11) {
		//Ninth Answer
		add_instruction(make_prompt(basePrompt + "有，在顧客的左手邊。"))

		updateQuestionNumber(8);
		updateQuestion("帶草帽的男子，有將手放入口袋嗎？");
		updateAIText(temp);


		//Tenth Question
		call_Gemini("店員有親手把收銀機的錢拿給搶匪嗎？");
	}

	//*********
	////////////////////////// BLOCK 11 ////////////////////////
	else if (total_dialogue == 12) {
		//Tenth Answer
		add_instruction(make_prompt(basePrompt + "沒有，店員受搶匪的脅迫打開收銀機，但是搶匪是自己親手偷取錢財。"))

		updateQuestionNumber(9);
		updateQuestion("收銀台旁有熟食區嗎？");
		updateAIText(temp);

		//Eleventh Question
		call_Gemini("搶匪翻越櫃台進入店員工作區域？");
	}

	////////////////////////// BLOCK 12 ////////////////////////
	else if (total_dialogue == 13) {
		//A11
		add_instruction(make_prompt(basePrompt + "是，有搶匪翻越櫃台進入店員工作區域。"))

		updateQuestionNumber(10);
		updateQuestion("店員有親手把收銀機的錢拿給搶匪嗎？");
		updateAIText(temp);

		//Q12
		call_Gemini("兩名店員依據搶匪指示舉起雙手。");
	}

	////////////////////////// BLOCK 13 ////////////////////////
	else if (total_dialogue == 14) {
		//A12
		add_instruction(make_prompt(basePrompt + "否，只有一名店員，雙手舉高示意投降。"))

		updateQuestionNumber(11);
		updateQuestion("搶匪翻越櫃台進入店員工作區域？");
		updateAIText(temp);

		//Q13
		call_Gemini("搶案發生時，有一名穿白色背心的男子從門外走進店內嗎？");
	}

	////////////////////////// BLOCK 14 ////////////////////////
	else if (total_dialogue == 15) {
		//A13
		add_instruction(make_prompt(basePrompt + "否，只有有一名穿白色背心的男子從店內離開。"))

		updateQuestionNumber(12);
		updateQuestion("搶案發生時，有一名穿白色背心的男子從門外走進店內嗎？");
		updateAIText(temp);

		//Q14
		call_Gemini("搶匪，用槍威脅店員打開收銀機？");
	}
	////////////////////////// BLOCK 15 ////////////////////////
	else if (total_dialogue == 16) {
		//A14
		add_instruction(make_prompt(basePrompt + "否，搶匪是使用沒工刀脅迫店員打開收銀機。"))

		updateQuestionNumber(13);
		updateQuestion("搶匪，用槍威脅店員打開收銀機？");
		updateAIText(temp);

		//Q15
		call_Gemini("店員用鑰匙打開收銀機？");
	}

	////////////////////////// BLOCK 16 ////////////////////////
	else if (total_dialogue == 17) {
		//A15
		add_instruction(make_prompt(basePrompt + "否，店員是在螢幕輸入相關資料打開收銀機。"))

		updateQuestionNumber(14);
		updateQuestion("店員用鑰匙打開收銀機？");
		updateAIText(temp);

		//Q16
		call_Gemini("搶匪把收銀機的錢放進口袋？");
	}
	////////////////////////// BLOCK 17 ////////////////////////
	else if (total_dialogue == 18) {
		//A16
		add_instruction(make_prompt(basePrompt + "沒有，搶匪用雙手抓取錢，就離開了。"))

		updateQuestionNumber(15);
		updateQuestion("搶匪把收銀機的錢放進口袋？")
		updateAIText(temp);

		//Q17
		call_Gemini("搶案期間，有顧客當時衝出店外嗎？");
	}

	////////////////////////// BLOCK 18 ////////////////////////
	else if (total_dialogue == 19) {
		//A17
		add_instruction(make_prompt(basePrompt + "沒有，但有一名穿白色背心的男子從店內離開。"))

		updateQuestionNumber(16);
		updateQuestion("搶案期間，有顧客當時衝出店外嗎？");
		updateAIText(temp);

		//Q18
		call_Gemini("搶匪除了拿了錢，還偷了一瓶水才離開？");
	}

	////////////////////////// BLOCK 19 ////////////////////////
	else if (total_dialogue == 20) {
		//A18
		add_instruction(make_prompt(basePrompt + "否，搶匪拿了錢，翻閱櫃檯時，順手將瓶裝水撥到地上，未拿離開。"))

		updateQuestionNumber(17);
		updateQuestion("搶匪除了拿了錢，還偷了一瓶水才離開？");
		updateAIText(temp);

		//Q19
		call_Gemini("事發當下櫃台周圍有其他顧客靠近嗎？");
	}

	////////////////////////// BLOCK 20 ////////////////////////
	else if (total_dialogue == 21) {
		//A19
		add_instruction(make_prompt(basePrompt + "否，沒有其他顧客靠近。"))

		updateQuestionNumber(18);
		updateQuestion("事發當下櫃台周圍有其他顧客靠近嗎？");
		updateAIText(temp);

		//Q20
		call_Gemini("白色衣服的顧客離開前有看一眼收銀台？");
	}

	////////////////////////// BLOCK 21 ////////////////////////
	else if (total_dialogue == 22) {
		//A20
		add_instruction(make_prompt(basePrompt + "是，他離開前撇一眼收銀台。"))

		updateQuestionNumber(19);
		updateQuestion("白色衣服的顧客離開前有看一眼收銀台？");
		updateAIText(temp);

		//Good bye!
		call_Gemini("你在問答過程中是否遇到任何技術問題？");
	}
	////////////////////////// BLOCK 22 ////////////////////////
	else if (total_dialogue == 23) {
		//A21
		add_other_bubble("好的，已記錄！");

		updateQuestionNumber(20);
		updateQuestion("白色衣服的顧客離開前有看一眼收銀台？");
		updateAIText(temp);

		setTimeout(function() {
			add_other_bubble("感謝您的回答，請返回問卷內容繼續填答，謝謝您！");
		}, 2500);
	}




	//initiate the conversation
	//save_conversation();


	if (total_dialogue > 3 && qualtrics_code !== '') {
		send_dinsaur();
	}

	total_dialogue = total_dialogue + 1;
	// console.log("TOTAL DIALOGUE: " + total_dialogue);

}
// 在網頁載入時自動啟動對話
window.addEventListener('DOMContentLoaded', function() {
    conversation_control();
});
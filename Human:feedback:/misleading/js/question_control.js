var randomValue = 0;

function generateRandomValue() {
	randomValue = Math.floor(Math.random() * 10000000000);
	// console.log(randomValue);
}
generateRandomValue();

function conversation_control() {
	if (total_dialogue == 0) {
		add_other_bubble("您好，我是一名警探，敝姓陳，我的職責是偵查犯罪現場。您的觀察將有助於我們釐清整起案件的經過，我將詢問您幾個問題，請根據您的記憶作答，但請不要推測或猜測你沒看到的情節。輸入'ok'繼續。");
	}

	else if (total_dialogue == 1) {
		add_instruction("[系統記憶] 請告訴用戶準備回答問題，提醒他們回憶剛才觀看的影片。同時告訴他們需完成20題問題'輸入ok繼續。'")
		call_Gemini();
	}

	////////////////////////// FIRST BLOCK////////////////////////
	else if (total_dialogue == 2) {
		//First Question (8 in doc)
		setTimeout(function() {
			add_other_bubble("搶匪進入商店前，天色變黑了嗎？")
		}, 2500);

	}
	////////////////////////// SECOND BLOCK ////////////////////////

	else if (total_dialogue == 3) {
		//First Answer
		add_instruction(make_prompt(basePrompt + "搶匪進入商店前天色已黑。"))

		//Second Question (5 in doc)
		call_Gemini("你是否有注意到，有刺青的搶匪威脅正在結帳的顧客，對方嚇得整個人趴下？");


	}
	////////////////////////// THIRD BLOCK ////////////////////////

	else if (total_dialogue == 4) {
		//Second Answer
		add_instruction(make_prompt(improvPrompt) + `Acknowledge the utility of their insight by mentioning that ${getRandomElement(reinforcers)}.`)


		updateQuestionNumber(1);
		updateQuestion("搶匪進入商店前，天色變黑了嗎？");
		updateAIText(temp);

		//Third Question (14 in doc)
		call_Gemini("搶劫期間，有女收銀員在收銀台協助顧客？");

	}

	////////////////////////// FOURTH BLOCK ////////////////////////

	else if (total_dialogue == 5) {
		//Third Answer
		add_instruction(make_prompt(basePrompt + "搶劫期間有女收銀員在櫃台協助顧客。"))

		updateQuestionNumber(2);
		updateQuestion("你是否有注意到，有刺青的搶匪威脅正在結帳的顧客，對方嚇得整個人趴下？");
		updateAIText(temp);

		//Fourth Question (18 in doc)
		call_Gemini("有搶匪同時帶了兩種以上的武器嗎？");
	}
	////////////////////////// FIFTH BLOCK ////////////////////////


	else if (total_dialogue == 6) {
		//Fourth Answer
		add_instruction(make_prompt(basePrompt + "沒有搶匪攜帶超過一把槍械。"))

		updateQuestionNumber(3);
		updateQuestion("你是否有注意到，搶劫期間有女收銀員在櫃台協助顧客？");
		updateAIText(temp);

		//Fifth Question (17 in doc)
		call_Gemini("搶劫期間，有其他顧客走進店裡嗎？");

	}

	////////////////////////// SIXTH BLOCK ////////////////////////

	else if (total_dialogue == 7) {
		//Fifth Answer
		add_instruction(make_prompt(basePrompt + "搶劫期間沒有顧客進出商店。"))

		updateQuestionNumber(4);
		updateQuestion("你是否有注意到，有搶匪攜帶超過一把槍械？");
		updateAIText(temp);

		//Sixth Question (1 in doc)
		call_Gemini("你是否有注意到，搶匪搭乘黑色的轎車抵達商店呢？");

	}

	////////////////////////// SEVENTH BLOCK ////////////////////////
	else if (total_dialogue == 8) {
		//Sixth Answer
		add_instruction(make_prompt(improvPrompt) + `Acknowledge the utility of their insight by mentioning that ${getRandomElement(reinforcers)}.`)

		updateQuestionNumber(5);
		updateQuestion("搶劫期間，有其他顧客走進店裡嗎？");
		updateAIText(temp);

		//Seventh Question (19 in doc)
		call_Gemini("你是否有注意到，搶匪把錢放進後背包，還順手拿走店裡其他商品？");

	}

	////////////////////////// EIGHTH BLOCK ////////////////////////

	else if (total_dialogue == 9) {
		//Seventh Answer
		add_instruction(make_prompt(improvPrompt) + `Acknowledge the utility of their insight by mentioning that ${getRandomElement(reinforcers)}.`)

		updateQuestionNumber(6);
		updateQuestion("你是否有注意到，搶匪搭乘黑色的轎車抵達商店呢？");
		updateAIText(temp);


		//Eighth Question (22 in doc)
		call_Gemini("搶案期間，店裡商品有明顯破壞嗎？");

	}

	////////////////////////// BLOCK 9 ////////////////////////
	else if (total_dialogue == 10) {
		//Eighth Answer
		add_instruction(make_prompt(basePrompt + "沒有搶匪攜帶超過一把槍械。"))

		updateQuestionNumber(7);
		updateQuestion("你是否有注意到，搶匪把錢放進後背包，還順手拿走店裡其他商品？");
		updateAIText(temp);


		//Ninth Question (11 in doc)
		call_Gemini("搶案發生時，有搶匪親自打開收銀機拿錢嗎？");

		////////////////////////// BLOCK 10 ////////////////////////
	}
	else if (total_dialogue == 11) {
		//Ninth Answwer
		add_instruction(make_prompt(basePrompt + "搶匪沒有親自從商店內的收銀機拿錢。"))

		updateQuestionNumber(8);
		updateQuestion("搶案期間，店裡商品有明顯破壞嗎？");
		updateAIText(temp);


		//Tenth Question (25 in doc)
		call_Gemini("有一名搶匪跳過櫃台，靠近收銀員嗎？");
	}

	//*********
	////////////////////////// BLOCK 11 ////////////////////////
	else if (total_dialogue == 12) {
		//Tenth Answer
		add_instruction(make_prompt(basePrompt + "其中一個搶劫犯確實跳過收銀台。"))

		updateQuestionNumber(9);
		updateQuestion("搶案發生時，有搶匪試著打開收銀機拿錢嗎？");
		updateAIText(temp);

		//Eleventh Question (15 in doc)
		call_Gemini("女收銀員有逃到店後方嗎？");
	}

	////////////////////////// BLOCK 12 ////////////////////////
	else if (total_dialogue == 13) {
		//A11
		add_instruction(make_prompt(basePrompt + "女收銀員在搶劫期間沒有逃到商店後方。"))

		updateQuestionNumber(10);
		updateQuestion("有一名搶匪跳過櫃台，靠近收銀員嗎？");
		updateAIText(temp);

		//Q12 (13 in doc)
		call_Gemini("收銀員是否試圖打電話？");
	}

	////////////////////////// BLOCK 13 ////////////////////////
	else if (total_dialogue == 14) {
		//A12
		add_instruction(make_prompt(basePrompt + "否，收銀員沒有人試圖打電話。"))

		updateQuestionNumber(11);
		updateQuestion("女收銀員有逃到店後方嗎？");
		updateAIText(temp);

		//Q13 (12 in doc)
		call_Gemini("店內是否掛著監視器螢幕？");
	}

	////////////////////////// BLOCK 14 ////////////////////////
	else if (total_dialogue == 15) {
		//A13
		add_instruction(make_prompt(basePrompt + "是，監視器螢幕掛在牆上。"))

		updateQuestionNumber(12);
		updateQuestion("收銀員是否試圖打電話？");
		updateAIText(temp);

		//Q14 (23 in doc)
		call_Gemini("有一名搶匪看起來年紀很輕，可能還不到18歲嗎？");
	}
	////////////////////////// BLOCK 15 ////////////////////////
	else if (total_dialogue == 16) {
		//A14
		add_instruction(make_prompt(basePrompt + "沒有搶匪看起來年紀很輕。"))

		updateQuestionNumber(13);
		updateQuestion("店內是否掛著監視器螢幕？");
		updateAIText(temp);

		//Q15 (2 in doc)
		call_Gemini("你是否有注意到，有男顧客試圖反抗手持刀械的搶匪？");
	}

	////////////////////////// BLOCK 16 ////////////////////////
	else if (total_dialogue == 17) {
		//A15
		add_instruction(make_prompt(improvPrompt))

		updateQuestionNumber(14);
		updateQuestion("有一名搶匪看起來年紀很輕，可能還不到18歲嗎？");
		updateAIText(temp);

		//Q16 (21 in doc)
		call_Gemini("搶匪除了威脅顧客，他有開槍嗎？");
	}
	////////////////////////// BLOCK 17 ////////////////////////
	else if (total_dialogue == 18) {
		//A16
		add_instruction(make_prompt(basePrompt + "沒有搶匪開槍射擊。"))

		updateQuestionNumber(15);
		updateQuestion("你是否有注意到，有男顧客試圖反抗手持刀械的搶匪？")
		updateAIText(temp);

		//Q17(4 in doc)
		call_Gemini("你是否有注意到，穿深棕色帽T的搶匪拿槍威脅收銀員，讓收銀員只好交出現金？");
	}

	////////////////////////// BLOCK 18 ////////////////////////
	else if (total_dialogue == 19) {
		//A17
		add_instruction(make_prompt(improvPrompt) + `Acknowledge the utility of their insight by mentioning that ${getRandomElement(reinforcers)}.`)

		updateQuestionNumber(16);
		updateQuestion("搶匪除了威脅顧客，他有開槍嗎？");
		updateAIText(temp);

		//Q18 (16 in doc)
		call_Gemini("搶匪進來時，收銀台有女性顧客在結帳嗎？");
	}

	////////////////////////// BLOCK 19 ////////////////////////
	else if (total_dialogue == 20) {
		//A18
		add_instruction(make_prompt(basePrompt + "搶匪進來時，沒有女性顧客，只有穿棒球外套的男性顧客在結帳。"))

		updateQuestionNumber(17);
		updateQuestion("你是否有注意到，穿深棕色帽T的搶匪拿槍威脅收銀員，讓收銀員只好交出現金？");
		updateAIText(temp);

		//Q19 (24 in doc)
		call_Gemini("穿灰色帽T的搶匪有在進門後反鎖店門嗎？");
	}

	////////////////////////// BLOCK 20 ////////////////////////
	else if (total_dialogue == 21) {
		//A19
		add_instruction(make_prompt(basePrompt + "穿灰色帽T的搶匪進入後沒有試圖鎖上商店門。") + `如果答案符合事實，通過提到${getRandomElement(reinforcers)}來認可他們見解的有用性。`)

		updateQuestionNumber(18);
		updateQuestion("搶匪進來時，收銀台有女性顧客在結帳嗎？");
		updateAIText(temp);

		//Q20 (20 in doc)
		call_Gemini("影片中總共有三位搶匪嗎？");
	}

	////////////////////////// BLOCK 21 ////////////////////////
	else if (total_dialogue == 22) {
		//A20
		add_instruction(make_prompt(basePrompt + "是，共三位搶匪。"))

		updateQuestionNumber(19);
		updateQuestion("穿灰色帽T的搶匪有在進門後反鎖店門嗎？");
		updateAIText(temp);

		//Good bye!
		call_Gemini("你在問答過程中是否遇到任何技術問題？");
	}
	////////////////////////// BLOCK 22 ////////////////////////
	else if (total_dialogue == 23) {
		//A21
		add_other_bubble("好的，已記錄！");

		updateQuestionNumber(20);
		updateQuestion("影片中總共有三位搶匪嗎？");
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
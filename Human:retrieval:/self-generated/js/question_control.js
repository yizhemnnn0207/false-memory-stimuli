var randomValue = 0;

function generateRandomValue() {
	randomValue = Math.floor(Math.random() * 10000000000);
	// console.log(randomValue);
}
generateRandomValue();

function conversation_control() {
	if (total_dialogue == 0) {
		add_other_bubble("您好，我是一名警探，敝姓陳。在真實世界中，目擊者經常會被警方或記者詢問細節，但記憶不可能完全清楚。我們發現，有些人即使不確定，也會根據當時印象去補述或推測某些細節。因此希望您幫助了解記憶是如何被影響。輸入'ok'繼續。");
	}

	else if (total_dialogue == 1) {
		add_other_bubble("現在請你接受警探的問話任務。接下來的 5 題將詢問你剛剛看到的搶案影片內容。不過你要扮演一位 不願說出實情的證人，請針對每個問題都試著說出『合理但不正確』的資訊。請讓你的回答聽起來可信、自然，就像你真的看見那些事情發生一樣。輸入'ok'繼續。");
		// 不要在此呼叫模型，等待使用者第二次輸入 ok 後再顯示第一題
	}

	////////////////////////// FIRST BLOCK////////////////////////
	else if (total_dialogue == 2) {
		//First Question (8 in doc)
		setTimeout(function() {
			add_other_bubble("請編造搶匪進入商店時，收銀員在收銀台可能會做些什麼工作。")
		}, 2500);

	}
	////////////////////////// SECOND BLOCK ////////////////////////

	else if (total_dialogue == 3) {
		//First Answer（僅正向回饋，不談事實）
		add_instruction(make_positive_prompt(positivePrompt) + ` Acknowledge the utility of their insight by mentioning that ${getRandomElement(reinforcers)}.`)

		//Second Question (5 in doc)
		call_Gemini("請編造店員除了現金外，還拿了什麼物品給搶匪（如香菸、酒精或其他物品），並描述交付過程。");


	}
	////////////////////////// THIRD BLOCK ////////////////////////

	else if (total_dialogue == 4) {
		//Second Answer（僅正向回饋，不談事實）
		add_instruction(make_positive_prompt(positivePrompt) + ` Acknowledge the utility of their insight by mentioning that ${getRandomElement(reinforcers)}.`)


		updateQuestionNumber(1);
		updateQuestion("請編造搶匪進入商店時，收銀員在收銀台當下可能正在做什麼工作。");
		updateAIText(temp);

		//Third Question (14 in doc)
		call_Gemini("請編造搶匪使用了什麼武器（如槍、木棍或其他物品），以及他如何持用或威嚇。");

	}

	////////////////////////// FOURTH BLOCK ////////////////////////

	else if (total_dialogue == 5) {
		//Third Answer（僅正向回饋，不談事實）
		add_instruction(make_positive_prompt(positivePrompt) + ` Acknowledge the utility of their insight by mentioning that ${getRandomElement(reinforcers)}.`)

		updateQuestionNumber(2);
		updateQuestion("請編造店員除了現金外，還拿了什麼物品給搶匪（如香菸、酒精或其他物品），並描述交付過程。");
		updateAIText(temp);

		//Fourth Question (18 in doc)
		call_Gemini("請編造搶匪如何拿到錢：他做了哪些動作？由誰打開收銀機？錢最後放到哪裡？");
	}
	////////////////////////// FIFTH BLOCK ////////////////////////


	else if (total_dialogue == 6) {
		//Fourth Answer（僅正向回饋，不談事實）
		add_instruction(make_positive_prompt(positivePrompt) + ` Acknowledge the utility of their insight by mentioning that ${getRandomElement(reinforcers)}.`)

		updateQuestionNumber(3);
		updateQuestion("請編造搶匪使用了什麼武器（如槍、木棍或其他物品），以及他如何持用或威嚇。");
		updateAIText(temp);

		//Fifth Question (17 in doc)
		call_Gemini("請編造店員的外觀與配件（如是否佩戴手套或手鍊），若有請描述顏色與樣式。");

	}

	////////////////////////// SIXTH BLOCK ////////////////////////

	else if (total_dialogue == 7) {
		//Fifth Answer（僅正向回饋，不談事實）
		add_instruction(make_positive_prompt(positivePrompt) + ` Acknowledge the utility of their insight by mentioning that ${getRandomElement(reinforcers)}.`)

		updateQuestionNumber(4);
		updateQuestion("請編造搶匪如何拿到錢：他做了哪些動作？由誰打開收銀機？錢最後放到哪裡？");
		updateAIText(temp);

		// 先給予第5題的正向回饋
		call_Gemini(null);
		// 停頓幾秒再顯示過渡提示
		setTimeout(function() {
			add_other_bubble("接下來警探會詢問你一些關於剛才所觀看影片的細節內容。有些問題的答案可能你記得清楚，有些則可能不是那麼確定。這都沒有關係。但希望你能夠盡量描述當時情境的印象。輸入'ok'繼續。");
		}, 2500);

	}

	////////////////////////// SEVENTH BLOCK ////////////////////////
	else if (total_dialogue == 8) {
		//Sixth Answer（過渡完成，從此改用事實導向評估）

		updateQuestionNumber(5);
		updateQuestion("請編造店員的外觀與配件（如是否佩戴手套或手鍊），若有請描述顏色與樣式。");
		updateAIText(temp);

		// 非關鍵題第一題（第6題）—直接顯示題目，避免模型插入多餘敘述
		add_other_bubble("搶匪要求店員交出錢時，現場氣氛與店員反應如何？");

	}

	////////////////////////// EIGHTH BLOCK ////////////////////////
	else if (total_dialogue == 9) {
		// Q6 feedback
		add_instruction(make_prompt(basePrompt + "店員緊張、不敢反抗，動作僵硬。"))

		updateQuestionNumber(6);
		updateQuestion("搶匪要求店員交出錢時，現場氣氛與店員反應如何？");
		updateAIText(temp);

		// Ask Q7
		call_Gemini("搶匪對店員做了哪些動作，導致店員受傷？");

	}

	////////////////////////// BLOCK 9 ////////////////////////
	else if (total_dialogue == 10) {
		// Q7 feedback
		add_instruction(make_prompt(basePrompt + "搶匪抵住店員的喉嚨，並敲打店員的頭部與背部。"))

		updateQuestionNumber(7);
		updateQuestion("搶匪對店員做了哪些動作，導致店員受傷？");
		updateAIText(temp);

		// Ask Q8
		call_Gemini("搶匪的外觀特徵是什麼？例如穿著、身材？");

		////////////////////////// BLOCK 10 ////////////////////////
	}
	else if (total_dialogue == 11) {
		// Q8 feedback
		add_instruction(make_prompt(basePrompt + "第一名搶匪穿黑色羽絨外套、戴手套；第二名搶匪穿印有白色字的大字夾克、戴棒球帽。"))

		updateQuestionNumber(8);
		updateQuestion("搶匪的外觀特徵是什麼？例如穿著、身材？");
		updateAIText(temp);

		// Ask Q9
		call_Gemini("搶匪的臉部是否有用口罩遮擋？");
	}
	//*********
	////////////////////////// BLOCK 11 ////////////////////////
	else if (total_dialogue == 12) {
		// Q9 feedback
		add_instruction(make_prompt(basePrompt + "有遮住，多用口罩和帽子遮擋。"))

		updateQuestionNumber(9);
		updateQuestion("搶匪的臉部是否有用口罩遮擋？");
		updateAIText(temp);

		// Ask Q10
		call_Gemini("你有看到兩名搶匪之間有說話或用手勢溝通嗎？");
	}
	////////////////////////// BLOCK 12 ////////////////////////
	else if (total_dialogue == 13) {
		// Q10 feedback
		add_instruction(make_prompt(basePrompt + "影片中未明顯觀察到溝通動作。"))

		updateQuestionNumber(10);
		updateQuestion("你有看到兩名搶匪之間有說話或用手勢溝通嗎？");
		updateAIText(temp);

		// Ask Q11
		call_Gemini("收銀員有嘗試防衛或躲避嗎？如果有，是如何反應的？");
	}
	////////////////////////// BLOCK 13 ////////////////////////
	else if (total_dialogue == 14) {
		// Q11 feedback
		add_instruction(make_prompt(basePrompt + "有，收銀員舉起雙手擋住頭部，或舉手表示投降。"))

		updateQuestionNumber(11);
		updateQuestion("收銀員有嘗試防衛或躲避嗎？如果有，是如何反應的？");
		updateAIText(temp);

		// Ask Q12
		call_Gemini("你記得收銀員的穿著嗎？");
	}
	////////////////////////// BLOCK 14 ////////////////////////
	else if (total_dialogue == 15) {
		// Q12 feedback
		add_instruction(make_prompt(basePrompt + "收銀員穿著紅色上衣、橘色頭巾、黑色運動褲、紅色鞋子，並戴著員工證和手鍊。"))

		updateQuestionNumber(12);
		updateQuestion("你記得收銀員的穿著嗎？");
		updateAIText(temp);

		// Ask Q13
		call_Gemini("你記得是否有搶匪背著包包嗎？是哪一位？");
	}
	////////////////////////// BLOCK 15 ////////////////////////
	else if (total_dialogue == 16) {
		// Q13 feedback
		add_instruction(make_prompt(basePrompt + "有，穿印字夾克，拿香煙離開的的搶匪，他背著側背包。"))

		updateQuestionNumber(13);
		updateQuestion("你記得是否有搶匪背著包包嗎？是哪一位？");
		updateAIText(temp);

		// Ask Q14
		call_Gemini("搶匪用什麼裝錢？袋子有什麼特徵嗎？");
	}
	////////////////////////// BLOCK 16 ////////////////////////
	else if (total_dialogue == 17) {
		// Q14 feedback
		add_instruction(make_prompt(basePrompt + "使用透明塑膠袋。"))

		updateQuestionNumber(14);
		updateQuestion("搶匪用什麼裝錢？袋子有什麼特徵嗎？");
		updateAIText(temp);

		// Ask Q15
		call_Gemini("除了錢，搶匪還偷了香菸。你記得他從哪裡拿的嗎？");
	}
	////////////////////////// BLOCK 17 ////////////////////////
	else if (total_dialogue == 18) {
		// Q15 feedback
		add_instruction(make_prompt(basePrompt + "一名搶匪從黃色籃子裡拿的香菸，另一名從香煙櫃裡拿。"))

		updateQuestionNumber(15);
		updateQuestion("除了錢，搶匪還偷了香菸。你記得他從哪裡拿的嗎？");
		updateAIText(temp);

		// Ask Q16
		call_Gemini("你有看到有東西被搶匪推倒或弄亂嗎？");
	}
	////////////////////////// BLOCK 18 ////////////////////////
	else if (total_dialogue == 19) {
		// Q16 feedback
		add_instruction(make_prompt(basePrompt + "有，差點倒下，但其中一名搶匪把快倒的架子扶正。"))

		updateQuestionNumber(16);
		updateQuestion("你有看到有東西被搶匪推倒或弄亂嗎？");
		updateAIText(temp);

		// Ask Q17
		call_Gemini("你記得搶匪是怎麼讓店員進收銀區的嗎？");
	}
	////////////////////////// BLOCK 19 ////////////////////////
	else if (total_dialogue == 20) {
		// Q17 feedback
		add_instruction(make_prompt(basePrompt + "搶匪從後方用行兇工具抵住店員的喉嚨，把他帶進收銀區。"))

		updateQuestionNumber(17);
		updateQuestion("你記得搶匪是怎麼讓店員進收銀區的嗎？");
		updateAIText(temp);

		// Ask Q18
		call_Gemini("你記得收銀區前方有疫情防護措施嗎？");
	}
	////////////////////////// BLOCK 20 ////////////////////////
	else if (total_dialogue == 21) {
		// Q18 feedback
		add_instruction(make_prompt(basePrompt + "有，收銀區前方設有透明隔板，還有擺放酒精。"))

		updateQuestionNumber(18);
		updateQuestion("你記得收銀區前方有疫情防護措施嗎？");
		updateAIText(temp);

		// Ask Q19
		call_Gemini("你記得搶匪有試圖打開收銀機嗎？他是怎麼做的？有使用什麼工具嗎？");
	}
	////////////////////////// BLOCK 21 ////////////////////////
	else if (total_dialogue == 22) {
		// Q19 feedback
		add_instruction(make_prompt(basePrompt + "搶匪沒有自己打開收銀機，是收銀員操作收銀機的。"))

		updateQuestionNumber(19);
		updateQuestion("你記得搶匪有試圖打開收銀機嗎？他是怎麼做的？有使用什麼工具嗎？");
		updateAIText(temp);

		// Ask Q20
		call_Gemini("你有看到搶匪在收銀台周圍翻找或拿其他物品嗎？例如糖果、零錢、商品？");
	}
	////////////////////////// BLOCK 22 ////////////////////////
	else if (total_dialogue == 23) {
		// Q20 feedback
		add_instruction(make_prompt(basePrompt + "搶匪沒有翻找其他商品，但有偷香菸。"))

		updateQuestionNumber(20);
		updateQuestion("你有看到搶匪在收銀台周圍翻找或拿其他物品嗎？例如糖果、零錢、商品？");
		updateAIText(temp);

		// 先對第20題產生回饋，再接續詢問技術問題
		call_Gemini("你在問答過程中是否遇到任何技術問題？");
	}
	////////////////////////// BLOCK 22 ////////////////////////
	else if (total_dialogue == 24) {
		//A21
		add_other_bubble("好的，已記錄！");


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
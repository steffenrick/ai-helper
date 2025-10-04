'use strict'

import { GoogleGenAI } from 'https://esm.run/@google/genai'

class App {
  #inpTargetUrl = document.querySelector('.target_url')
  #inpAddress = document.querySelector('.inp_address')
  #inpName = document.querySelector('.inp_name')
  #inpEmail = document.querySelector('.inp_email')
  #btnGetIt = document.querySelector('.btn_getIt')
  #resultsBox = document.querySelector('.results_box')
  #apiKey = 'AIzaSyDwkq3d6zSZlkiOaVDPaWB2tNG7oYO0NXU'
  #aiInstructions = `
    My name is [Insert_name].

    My email address is [Insert_email]. I am happy to correspond electronically.

    My address is [Insert_address].

    Please identify my MP based on my above-noted address, making sure you are identifying the MP elected in July 2024 or since then, if a by-election has been held. Double check you have identified my MP correctly using this website. https://members.parliament.uk/FindYourMP

    I want you to write a letter to my MP.

    The letter should raise my concerns about the issues raised in this article [Insert blog post url]. Please fetch the content from the url I have provided.

    I would like you to:

	Include a title in the letter based on the primary issue addressed in this post.
	Summarise the concerns raised in the blog post using numbered paragraphs. If you wish to highlight the subject of each paragraph using bold text in its first sentence, please feel free to do so.
	You do not need to reference the source material, but can if you want to do so.
	Summarise the issues arising from the concerns, again using numbered paragraphs, and again using bold text in the first sentence of each paragraph to highlight what the issue arising is, if you think it appropriate.
	Ask the MP to take action. Please feel free to generate possibilities within the range of those normally open to an MP, but you might wish to mention:
	    Raising the issue with a minister
	    Asking a question in the House
	    Tabling an Early Day Motion
	    Supporting a Commons committee investigating the issue
	    Raising the matter with an All Party Parliamentary Group
	Ask the MP to provide feedback on actions taken and responses received.

    The tone of the letter should be polite and confident but should make it clear that a response is expected, as is action.

    Please include my MP's full address. Add today's date to the letter. Put the title after the salutation. Put my name and address in the opening paragraph as MPs need to know that information.

    Thank you for your assistance.`
  
  constructor () {
    this.#btnGetIt.addEventListener('click', this._getUrl.bind(this))
    // this._queryGoogleAi()
  }

  async _getUrl () {
    const tgtUrl = this.#inpTargetUrl.value
    const name = this.#inpName.value || 'Guest'
    const email = this.#inpEmail.value || 'nomail'
    const address = this.#inpAddress.value
    console.log(tgtUrl)

    try {
      // const response = await fetch(tgtUrl)
      
      // if (!response.ok) {
      //       throw new Error(`HTTP error! status: ${response.status}`);
      // }

      // const data = await response.text()
      // console.log(data)
      const text = this._replacePlaceholders({
	name,
	email,
	address,
	url: tgtUrl
      })
      console.log(text)

      // Write info message
      this._updateResultsBox({updateText: 'Querying Google AI..'})

      // Query Google AI
      const res = await this._queryGoogleAi(text)

      // Write response
      this._updateResultsBox({updateText: res})

    } catch (err) {
      console.error(err.message)
    }
  }

  _replacePlaceholders ({ name, email, address, url }) {
    const updatedString = this.#aiInstructions
      .replace('[Insert_name]', name)
      .replace('[Insert_email]', email)
      .replace('[Insert_address]', address)
      .replace('[Insert blog post url]', url)
    return updatedString
  }

  async _queryGoogleAi (queryData) {
    const ai = new GoogleGenAI({ apiKey: this.#apiKey })
    const tools = [
      // { urlContext: {} },
      // { codeExecution: {} },
      {
	googleSearch: {
	}
      }
    ]
    const config = {
      thinkingConfig: {
	thinkingBudget: -1,
      },
      tools
    }
    const response = await ai.models.generateContent({
      // model: "gemini-2.5-flash-lite",
      model: "gemini-2.5-pro",
      // model: "gemini-2.5-flash",
      // contents: "Explain how AI works in a few words",
      // config: {
      //   thinkingConfig: {
      //     thinkingBudget: 0, // Disables thinking
      //   }
      // },
      config,
      contents: queryData
    })
    // console.log(response.text)
    console.log('AI request complete')
    return response.text
  }

  _updateResultsBox ({updateText}) {
    this.#resultsBox.innerText = updateText
  }
}

const app = new App()

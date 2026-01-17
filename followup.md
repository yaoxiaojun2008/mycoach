  def generate_follow_up_questions(self, report: EvaluationReport) -> list:
        """Generate personalized follow-up questions based on the evaluation report."""
        print(f"\n📚 GENERATING FOLLOW-UP QUESTIONS")
        print("=" * 60)
        print("Analyzing your writing to create personalized learning questions...")
        
        questions = []
        state = report.workflow_state
        
        # Generate questions based on style analysis
        if state.style_analysis:
            style = state.style_analysis
            questions.append({
                "question": f"Why is '{style.writing_style}' style appropriate for this type of writing?",
                "category": "Style",
                "level": "Intermediate",
                "goal": "Understand different writing styles and their purposes"
            })
            
            questions.append({
                "question": f"How can you adjust your tone to be more neutral when needed?",
                "category": "Style",
                "level": "Intermediate", 
                "goal": "Learn to control and adjust writing tone"
            })
        
        # Generate questions based on content evaluation
        if state.content_evaluation:
            content = state.content_evaluation
            
            questions.append({
                "question": "How do you choose more sophisticated vocabulary while keeping your writing clear?",
                "category": "Vocabulary",
                "level": "Intermediate",
                "goal": "Balance sophisticated vocabulary with clarity"
            })
            
            questions.append({
                "question": "What is the most effective way to structure an essay introduction?",
                "category": "Structure",
                "level": "Basic",
                "goal": "Master essay structure"
            })
            
            # Add specific questions based on weaknesses
            for weakness in content.weaknesses[:2]:  # Limit to first 2 weaknesses
                questions.append({
                    "question": f"How can you address the issue of '{weakness}' in your writing?",
                    "category": "Content",
                    "level": "Advanced",
                    "goal": "Improve specific writing aspects"
                })
        
        # Add a general question
        questions.append({
            "question": "How do you effectively integrate evidence to support your arguments?",
            "category": "Evidence",
            "level": "Intermediate",
            "goal": "Learn to support claims with evidence"
        })
        
        return questions
    
    def display_follow_up_questions(self, questions: list):
        """Display the generated follow-up questions."""
        print(f"\n✨ Here are personalized questions to help you improve your writing:")
        print("=" * 60)
        
        for i, q in enumerate(questions, 1):
            print(f"{i}. {q['question']}")
            print(f"   📂 Category: {q['category']}")
            print(f"   📊 Level: {q['level']}")
            print(f"   🎯 Learning Goal: {q['goal']}")
            print()
        
        # Provide general suggestions
        print("💡 GENERAL SUGGESTIONS:")
        print("-" * 30)
        print("   • Continue leveraging your strengths: Clear communication")
        print("   • Work on organization and clarity to strengthen your writing")
        print("   • Read examples of excellent writing in your genre")
        print("   • Practice writing regularly to build fluency")
        
        # Provide practice exercises
        print("\n🏋️ PRACTICE EXERCISES:")
        print("-" * 30)
        print("   • Write a one-paragraph summary of your main argument")
        print("   • Read your writing aloud to check for flow and clarity")
    
    def get_detailed_answer(self, question_num: int, questions: list):
        """Provide a detailed educational answer to a specific question."""
        if question_num < 1 or question_num > len(questions):
            print("Invalid question number.")
            return
        
        question_data = questions[question_num - 1]
        question = question_data["question"]
        
        print(f"\n📖 DETAILED EDUCATIONAL ANSWER")
        print("=" * 60)
        print(f"Question: {question}")
        print("=" * 60)
        
        # Provide detailed answers based on the question
        if "sophisticated vocabulary" in question:
            print("📝 EXPLANATION:")
            print("-" * 30)
            print("Sophisticated vocabulary involves selecting precise, nuanced words that enhance meaning while maintaining clarity and appropriateness for your audience.")
            print("\n                The process involves several considerations:")
            print("                1. **Precision**: Choose words that convey exact meaning")
            print("                2. **Connotation**: Consider the emotional or cultural associations")
            print("                3. **Register**: Match formality level to your writing context")
            print("                4. **Clarity**: Ensure accessibility for your intended audience")
            print("\n                Advanced writers balance sophistication with comprehension, avoiding unnecessarily complex terms that obscure meaning.")
            
            print("\n📋 EXAMPLES:")
            print("-" * 30)
            print("   • Basic: 'The results were important.' → Sophisticated: 'The findings were pivotal to understanding the phenomenon.'")
            print("   • Basic: 'Many people disagree.' → Sophisticated: 'Scholars remain divided on this contentious issue.'")
            print("   • Basic: 'The idea is hard to understand.' → Sophisticated: 'The concept presents considerable complexity.'")
            
            print("\n💡 PRACTICAL TIPS:")
            print("-" * 30)
            print("   • Study word etymology to understand deeper meanings")
            print("   • Analyze vocabulary choices in professional writing")
            print("   • Consider multiple synonyms before selecting the most precise term")
            print("   • Balance sophistication with accessibility for your audience")
        
        elif "essay introduction" in question:
            print("📝 EXPLANATION:")
            print("-" * 30)
            print("An effective essay introduction serves multiple purposes: it grabs the reader's attention, provides background information, and presents a clear thesis statement.")
            print("\n                Key elements of a strong introduction:")
            print("                1. **Hook**: Start with an engaging sentence to capture interest")
            print("                2. **Background**: Provide context for your topic")
            print("                3. **Thesis Statement**: Clearly state your main argument")
            print("                4. **Roadmap**: Briefly outline the main points of your essay")
            
            print("\n📋 EXAMPLE STRUCTURE:")
            print("-" * 30)
            print("   • Begin with a relevant quote, question, or surprising fact")
            print("   • Follow with 2-3 sentences providing background information")
            print("   • End with a clear thesis statement that previews your argument")
            
            print("\n💡 PRACTICAL TIPS:")
            print("-" * 30)
            print("   • Keep introductions to about 10% of your total essay length")
            print("   • Write your introduction after completing your essay when possible")
            print("   • Make sure your thesis statement is specific and arguable")
            print("   • Ensure your introduction matches the tone of your essay")
        
        elif "tone" in question:
            print("📝 EXPLANATION:")
            print("-" * 30)
            print("Tone refers to the attitude or emotional quality of your writing. It affects how readers perceive your message and can make the difference between a persuasive and a confusing piece.")
            print("\n                Different tones include:")
            print("                1. **Formal**: Academic or professional writing")
            print("                2. **Informal**: Conversational or casual writing")
            print("                3. **Persuasive**: Convincing the reader of a position")
            print("                4. **Descriptive**: Creating vivid mental images")
            
            print("\n📋 TONE ADJUSTMENT STRATEGIES:")
            print("-" * 30)
            print("   • Formal: Use complete sentences, avoid contractions, and select precise vocabulary")
            print("   • Informal: Use contractions, shorter sentences, and familiar language")
            print("   • Persuasive: Include strong, definitive language and rhetorical questions")
            print("   • Descriptive: Use sensory details and figurative language")
            
            print("\n💡 PRACTICAL TIPS:")
            print("-" * 30)
            print("   • Consider your audience before determining the appropriate tone")
            print("   • Read your writing aloud to identify tone inconsistencies")
            print("   • Adjust word choices to match your intended tone")
            print("   • Maintain consistent tone throughout each piece of writing")
        
        else:
            # Default answer for other questions
            print("📝 EXPLANATION:")
            print("-" * 30)
            print(f"The question '{question}' addresses an important aspect of writing. To answer this effectively, consider the following:")
            print("\n                1. **Research**: Look for examples of excellent writing that demonstrate this concept")
            print("                2. **Practice**: Write exercises that specifically target this skill")
            print("                3. **Review**: Examine your own writing to identify areas for improvement")
            print("                4. **Feedback**: Seek input from others to validate your progress")
            
            print("\n📋 PRACTICE ACTIVITIES:")
            print("-" * 30)
            print("   • Find 2-3 examples of excellent writing that demonstrate this concept")
            print("   • Write a short piece focusing specifically on this skill")
            print("   • Compare your writing to the examples and identify differences")
            print("   • Revise your piece based on your observations")
            
            print("\n💡 PRACTICAL TIPS:")
            print("-" * 30)
            print("   • Start small and gradually increase complexity")
            print("   • Practice this skill regularly to build proficiency")
            print("   • Connect this concept to other writing skills you've learned")
            print("   • Track your improvement over time")
    
    async def run_interactive_session(self):
        """Run an interactive writing evaluation session."""
       
                
                # Follow-up options
                while True:
                    print(f"\n🤔 FOLLOW-UP OPTIONS")
                    print("=" * 60)
                    print("Which option would you like to follow up with?")
                    print()
                    print("1. 📚 Get follow-up questions about writing improvement")
                    print("2. 🔄 Test another piece of writing")
                    print("3. 👋 Exit")
                    print()
                    choice = input("Enter your choice (1-3) [default: 2]: ").strip() or "2"
                    
                    if choice == "1":
                        # Generate and display follow-up questions
                        questions = self.generate_follow_up_questions(report)
                        self.display_follow_up_questions(questions)
                        
                        # Allow user to get detailed answers
                        while True:
                            print(f"\n🤔 DETAILED ANSWER")
                            print("=" * 60)
                            detail_choice = input(f"Which question would you like me to answer in detail?\nEnter a number (1-{len(questions)}) or 'skip' to continue: ").strip().lower()
                            
                            if detail_choice == "skip":
                                break
                            
                            try:
                                question_num = int(detail_choice)
                                self.get_detailed_answer(question_num, questions)
                            except ValueError:
                                print("Invalid input. Please enter a number or 'skip'.")
                                continue
                            
                            # Ask if they want to see another detailed answer
                            continue_detail = input("\nWould you like to see another detailed answer? (y/n) [default: n]: ").strip().lower()
                            if continue_detail not in ['y', 'yes']:
                                break
                    elif choice == "2":
                        break  # Go back to get new user input
                    elif choice == "3":
                        print("\n👋 Thank you for using the Writing Coach! Goodbye!")
                        return  # Exit completely
                    else:
                        print("Invalid choice. Please enter 1, 2, or 3.")
            
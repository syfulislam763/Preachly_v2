import React, { useEffect, useState } from "react";
import { get_bible_versions } from "../screens/tabs/TabsAPI";
import { useAuth } from "../context/AuthContext";
import { get_onboarding_all_data } from "../screens/personalization/PersonalizationAPIs";

export const useStaticData = () => {
    const {store, updateStore} = useAuth();

    const denominations = [
        {
            "id": 0,
            "name": "None",
            "is_active": false
        },
        {
            "id": 11,
            "name": "Other",
            "is_active": false
        },
        {
            "id": 10,
            "name": "Orthodox",
            "is_active": false
        },
        {
            "id": 9,
            "name": "Adventist",
            "is_active": false
        },
        {
            "id": 8,
            "name": "Evangelical",
            "is_active": false
        },
        {
            "id": 7,
            "name": "Lutheran",
            "is_active": false
        },
        {
            "id": 6,
            "name": "Pentecostal",
            "is_active": false
        },
        {
            "id": 5,
            "name": "Methodist",
            "is_active": false
        },
        {
            "id": 4,
            "name": "Nondenominational",
            "is_active": false
        },
        {
            "id": 3,
            "name": "Baptist",
            "is_active": false
        },
        {
            "id": 2,
            "name": "Protestant",
            "is_active": false
        },
        {
            "id": 1,
            "name": "Catholic",
            "is_active": false
        }
    ]
    const faith_goal_questions = [
        {
            "id": 3,
            "question": "What would help you feel more equipped to achieve your faith goals?",
            "is_active": false,
            "options": [
                {
                    "id": 3,
                    "option": "Clear and inspired guidance rooted in scripture.",
                    "is_active": false
                },
                {
                    "id": 2,
                    "option": "Daily scripture insights that I can share with others or reflect on.",
                    "is_active": false
                },
                {
                    "id": 1,
                    "option": "Practical tools to respond to objections and questions about faith.",
                    "is_active": false
                }
            ]
        },
        {
            "id": 2,
            "question": "How do you hope to grow in your walk with God?",
            "is_active": false,
            "options": [
                {
                    "id": 6,
                    "option": "I want to inspire and encourage others through my faith journey.",
                    "is_active": false
                },
                {
                    "id": 5,
                    "option": "I want to strengthen my understanding of scripture and apply it to my life.",
                    "is_active": false
                },
                {
                    "id": 4,
                    "option": "I want to learn how to speak about my faith with confidence and clarity.",
                    "is_active": false
                }
            ]
        },
        {
            "id": 1,
            "question": "What’s holding you back from confidently living and sharing your faith?",
            "is_active": false,
            "options": [
                {
                    "id": 9,
                    "option": "I feel I need a deeper connection to God’s word before I can inspire others.",
                    "is_active": false
                },
                {
                    "id": 8,
                    "option": "I struggle to find the right words to share scripture effectively.",
                    "is_active": false
                },
                {
                    "id": 7,
                    "option": "I feel unsure how to respond to questions or doubts about my faith.",
                    "is_active": false
                }
            ]
        }
    ]
    
    const tone_preference_data = [
        {
            title: 'Clear and Hopeful',
            name: 'Clear and Hopeful',
            description: `Simple, direct, and encouraging. Speaks to God’s love and faithfulness in an easily understood way.`,
            quote: `"God allows us to choose because He loves us deeply. Even in our struggles, His grace is always enough.”`,
            icon: require("../../assets/img/24-leaf.png"),
            id: 1,
            is_active: false
        },
        {
            title: `Dynamic and Powerful`,
            name: `Dynamic and Powerful`,
            description: `Emotive, bold, and filled with vivid imagery. Designed to inspire and energize`,
            quote: `“Sin may exist, but so does God’s unstoppable power to redeem, restore, and turn every story into a victory.”`,
            icon: require("../../assets/img/24-sunset.png"),
            id: 2,
            is_active: false
        },
        {
            title: `Practical and Everyday`,
            name: `Practical and Everyday`,
            description: `Grounded and solution-oriented, focusing on how faith applies to daily life`,
            quote: `“Sometimes life feels messy, but God uses even our mistakes to shape us and teach us how to walk in His ways.”`,
            icon: require("../../assets/img/24-leaf.png"),
            id: 3,
            is_active: false
        },


        {
            title: `Encouraging and Purposeful`,
            name: `Encouraging and Purposeful`,
            description: `Focuses on meaning and growth through challenges, using affirming and positive language`,
            quote:`“It’s not always easy to understand, but God allows challenges so we can grow stronger in faith and closer to Him.”`,
            icon: require("../../assets/img/24-leaf.png"),
            id: 4,
            is_active: false
        },
        {
            title: `Uplifting and Optimistic`,
            name: `Uplifting and Optimistic`,
            description: `Highlights hope and joy even in adversity, emphasizing God’s ongoing provision`,
            quote: `“Even in a broken world, God’s love shines through. His plan for good will always outweigh the pain we see now.”`,
            icon: require("../../assets/img/24-sunset.png"),
            id: 5,
            is_active: false
        },
        {
            title: `Scholarly and Rational`,
            name: `Scholarly and Rational`,
            description: `Appeals to logic and reason, using well-structured arguments and historical/theological insights.`,
            quote: `“Sin entered through humanity’s choices, but God’s plan through Jesus shows us the depth of His justice and mercy.”`,
            icon: require("../../assets/img/24-leaf.png"),
            id: 6,
            is_active: false
        },

        {
            title: `Warm and Relatable`,
            name: `Warm and Relatable`,
            description: `Conversational, empathetic, and emotionally resonant. Speaks to the heart with compassion.`,
            quote: `“That’s a tough question—it’s okay to wrestle with it. What matters
        most is knowing God is with you, no matter what.”`,
            icon: require("../../assets/img/24-sunset.png"),
            id: 7,
            is_active: false
        },
        {
            title: `Passionate and Empowering`,
            name: `Passionate and Empowering`,
            description: `Focused on spiritual growth and perseverance, emphasizing strength and action`,
            quote: `“Sin doesn’t define us—God’s purpose does. You have the power to
        walk boldly in the freedom He’s given you.”`,
            icon: require("../../assets/img/24-leaf.png"),
            id: 8,
            is_active: false
        },
    ];
    const bible_familiarity_data = [
        {
            label: "None",
            id: 1,
            text1:"New to the Word? No problem!",
            text2:"",
            title:"Simplified Responses",
            name: "Simplified Responses",
            caption:"Preachly will break things down in an easy-to-understand way, offering clear, simple explanations to help you build a strong foundation.",
            is_active: false
        },
        { 
            label: "A Little",
            id: 2,
            text1:"A great foundation! Let's go deeper",
            text2:"You have some knowledge, and we'll build on it!",
            title:"In-Depth Responses",
            name: "In-Depth Responses",
            caption:"Preachly's answers will include context connections, and deeper insights to enrich your understanding",
            is_active: false
        },
        {
            label: "A Lot",
            id: 3,
            text1:"Ready for the deep dive?",
            text2:"",
            title:"Multi-Argumentation Responses",
            name: "Multi-Argumentation Responses",
            caption:"Preachly will provide multi-layered explanations, exploring different perspectives, theological arguments, and scriptural connections to help you sharpen your understanding",
            is_active: false
        }
    ]

    const bible_versions = [
        {
            "id": 5,
            "name": "NLT (New Living Translation)",
            "subtitle": null,
            "is_active": false
        },
        {
            "id": 4,
            "name": "ESV (English Standard Version)",
            "subtitle": null,
            "is_active": false
        },
        {
            "id": 3,
            "name": "ASV (American Standard Version)",
            "subtitle": null,
            "is_active": false
        },
        {
            "id": 2,
            "name": "WEB (World English Bible)",
            "subtitle": null,
            "is_active": false
        },
        {
            "id": 1,
            "name": "KJV (King James Version)",
            "subtitle": null,
            "is_active": false
        },
        {
            "id": 0,
            "name": "None",
            "is_active": false
        },
    ]

    const faith_journey_reasons = [
        {
            "id": 1,
            "name": "Clarity to overcome doubts",
            "is_active": false
        },
        {
            "id": 2,
            "name": "Confidence to share my beliefs",
            "is_active": false
        },
    ]


    useEffect(() => {
        get_onboarding_all_data((res, success) => {
            if(success){
                const denominations = res?.data?.denominations || [];
                denominations.push({
                    "id": 0,
                    "name": "None",
                    "is_active": false,
                    is_selected: false,
                })
                const faith_journey_reasons = res?.data?.journey_reasons || [];
                faith_journey_reasons = faith_journey_reasons.map(item => ({...item, name: item?.option}));

                const bible_versions = res?.data?.bible_versions || [];
                bible_versions = bible_versions.map(item => ({...item, name: item?.title}));
                
                const bible_familiarity_data = res?.data?.bible_familiarity || [];
                
                
                const tone_preference_data = res?.data?.tone_preferences || [];

                const faith_goal_questions = res?.data?.faith_goal_questions || [];

                updateStore({denominations, faith_goal_questions, faith_journey_reasons, bible_versions, bible_familiarity_data, tone_preference_data})

            }
        })
    }, [])


    return {
        denominations,
        faith_goal_questions,
        tone_preference_data,
        bible_familiarity_data,
        bible_versions,
        faith_journey_reasons
    }

}


export default useStaticData;
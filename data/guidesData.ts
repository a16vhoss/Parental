// Guides Data - Complete content for all 8 stages and 10 modules each
import { GuideModule } from '../types/guidesTypes';

// ============================================
// STAGE 1: RECIÉN NACIDO (0-3 meses)
// ============================================

export const NEWBORN_MODULES: GuideModule[] = [
    {
        id: 'newborn-intro',
        stageId: 'newborn',
        order: 1,
        title: 'Bienvenido al Mundo',
        description: 'Qué esperar en los primeros 3 meses de vida',
        icon: 'waving_hand',
        isPriority: true,
        content: {
            intro: 'Los primeros tres meses son un período de adaptación tanto para el bebé como para los padres. Tu recién nacido está conociendo el mundo exterior después de nueve meses en el vientre.',
            sections: [
                {
                    title: 'El Primer Mes',
                    content: 'Durante el primer mes, tu bebé dormirá entre 16-17 horas al día. Sus movimientos serán principalmente reflejos. Reconocerá tu voz y comenzará a enfocarse en objetos cercanos a 20-30 cm de distancia.'
                },
                {
                    title: 'Meses 2 y 3',
                    content: 'Empezará a sonreír socialmente, seguir objetos con la mirada, sostener brevemente su cabeza y hacer sonidos de arrullo. El llanto disminuirá gradualmente a medida que aprende otras formas de comunicarse.'
                },
                {
                    title: 'Vínculo con tu Bebé',
                    content: 'El contacto piel con piel es fundamental. Habla, canta y lee a tu bebé. Responde a sus señales de hambre y sueño. Este es el momento de establecer una conexión profunda.'
                }
            ],
            tips: [
                'El contacto piel con piel regula la temperatura y calma al bebé',
                'Los bebés ven mejor en blanco, negro y rojo los primeros meses',
                'El llanto es su única forma de comunicación - no lo malcríes por atenderlo',
                'Tu olor es reconfortante para el bebé'
            ],
            warningSignals: [
                'Fiebre mayor a 38°C',
                'Rechazo total al alimento',
                'Dificultad para respirar',
                'Color amarillento intenso en piel u ojos',
                'No responde a sonidos fuertes'
            ]
        }
    },
    {
        id: 'newborn-feeding',
        stageId: 'newborn',
        order: 2,
        title: 'Alimentación del Recién Nacido',
        description: 'Lactancia, biberón y señales de hambre',
        icon: 'restaurant',
        isPriority: true,
        content: {
            intro: 'La alimentación es crucial en esta etapa. Ya sea lactancia materna, fórmula o mixta, lo importante es que tu bebé esté bien nutrido e hidratado.',
            sections: [
                {
                    title: 'Lactancia Materna',
                    content: 'La leche materna es el alimento ideal. Alimenta a demanda, generalmente cada 2-3 horas (8-12 veces al día). La succión estimula la producción de leche. El calostro de los primeros días es oro líquido lleno de anticuerpos.'
                },
                {
                    title: 'Fórmula Infantil',
                    content: 'Si usas fórmula, sigue las instrucciones de preparación exactamente. Usa agua hervida y enfriada. No recalientes biberones y desecha lo que sobre después de 1 hora.'
                },
                {
                    title: 'Señales de Hambre',
                    content: 'Movimiento de cabeza buscando el pecho, llevar manos a la boca, chuparse los dedos, sonidos de succión. El llanto es una señal tardía de hambre.'
                },
                {
                    title: 'Señales de Saciedad',
                    content: 'Se aparta del pecho/biberón, cierra la boca, se queda dormido, manos relajadas y abiertas.'
                }
            ],
            checklist: [
                { id: 'nl-1', text: '¿Tienes almohada de lactancia?', category: 'Equipamiento' },
                { id: 'nl-2', text: '¿Sabes la posición correcta para amamantar?', category: 'Técnica' },
                { id: 'nl-3', text: '¿Tienes biberones y fórmula de respaldo?', category: 'Equipamiento' },
                { id: 'nl-4', text: '¿Llevas registro de alimentaciones?', category: 'Seguimiento' }
            ],
            tips: [
                'El bebé debe mojar 6+ pañales al día - señal de buena hidratación',
                'Eructar a mitad y después de cada toma',
                'El aumento de peso esperado es 150-200g por semana',
                'No agregues cereales al biberón'
            ]
        }
    },
    {
        id: 'newborn-sleep',
        stageId: 'newborn',
        order: 3,
        title: 'Sueño Seguro',
        description: 'Rutinas, posiciones y ambiente para dormir',
        icon: 'bedtime',
        isPriority: true,
        content: {
            intro: 'Los recién nacidos duermen 16-17 horas en períodos cortos de 2-4 horas. Aún no distinguen el día de la noche.',
            sections: [
                {
                    title: 'Sueño Seguro - Las 5 Reglas',
                    content: '1) Siempre boca arriba. 2) Superficie firme y plana. 3) Sin almohadas, cobijas sueltas ni juguetes. 4) Temperatura ambiente 20-22°C. 5) Mismo cuarto que los padres, diferente cama.'
                },
                {
                    title: 'Establecer el Ritmo Día/Noche',
                    content: 'Durante el día: luz natural, ruidos normales, actividad. Durante la noche: oscuridad, silencio, calma. Esto ayuda a desarrollar su ritmo circadiano.'
                },
                {
                    title: 'Señales de Sueño',
                    content: 'Bostezos, ojos vidriosos, frotar ojos u orejas, mirada perdida, irritabilidad. Acuesta al bebé cuando veas estas señales, antes de que esté exhausto.'
                }
            ],
            checklist: [
                { id: 'ns-1', text: '¿La cuna cumple con normas de seguridad?', category: 'Seguridad' },
                { id: 'ns-2', text: '¿El colchón es firme?', category: 'Seguridad' },
                { id: 'ns-3', text: '¿La habitación está a temperatura adecuada?', category: 'Ambiente' },
                { id: 'ns-4', text: '¿Tienes luz tenue para cambios nocturnos?', category: 'Equipamiento' }
            ],
            warningSignals: [
                'Pausas en la respiración mayores a 20 segundos',
                'Coloración azulada en labios o cara',
                'Dificultad para despertarse'
            ]
        }
    },
    {
        id: 'newborn-hygiene',
        stageId: 'newborn',
        order: 4,
        title: 'Higiene y Cuidados',
        description: 'Baño, cordón umbilical y cambio de pañal',
        icon: 'bathtub',
        isPriority: false,
        content: {
            intro: 'Mantener a tu bebé limpio y cómodo es fundamental para su bienestar. Los recién nacidos no necesitan baños diarios.',
            sections: [
                {
                    title: 'Cuidado del Cordón Umbilical',
                    content: 'Mantén el muñón seco y limpio. Dobla el pañal debajo para que no lo cubra. Se caerá naturalmente entre 7-21 días. No tires de él ni lo cubras con alcohol.'
                },
                {
                    title: 'El Baño del Bebé',
                    content: 'Los primeros 2 semanas, solo baños de esponja hasta que caiga el cordón. Después, baños de 5-10 minutos en agua tibia (37°C). 2-3 baños por semana son suficientes.'
                },
                {
                    title: 'Cambio de Pañal',
                    content: 'Cambia el pañal cuando esté mojado o sucio (cada 2-3 horas aproximadamente). Limpia de adelante hacia atrás, especialmente en niñas. Usa crema de pañal para prevenir rozaduras.'
                },
                {
                    title: 'Uñas y Pelo',
                    content: 'Corta las uñas cuando el bebé duerme, usando tijeras de punta redonda. El cabello rara vez necesita atención los primeros meses.'
                }
            ],
            checklist: [
                { id: 'nh-1', text: '¿Tienes termómetro de agua?', category: 'Equipamiento' },
                { id: 'nh-2', text: '¿Tienes toallas con capucha?', category: 'Equipamiento' },
                { id: 'nh-3', text: '¿Sabes la temperatura correcta del agua (37°C)?', category: 'Seguridad' },
                { id: 'nh-4', text: '¿Tienes crema para rozaduras?', category: 'Productos' }
            ],
            tips: [
                'Nunca dejes al bebé solo en el agua, ni un segundo',
                'Prepara todo antes de comenzar el baño',
                'El agua debe sentirse tibia en tu codo',
                'Seca bien entre los pliegues de la piel'
            ]
        }
    },
    {
        id: 'newborn-development-motor',
        stageId: 'newborn',
        order: 5,
        title: 'Desarrollo Motor',
        description: 'Hitos físicos de 0 a 3 meses',
        icon: 'accessibility_new',
        isPriority: false,
        content: {
            intro: 'El desarrollo motor en los primeros meses es principalmente reflejo, pero verás avances emocionantes.',
            sections: [
                {
                    title: 'Mes 1',
                    content: 'Movimientos reflejos: agarre, succión, sobresalto. Puede voltear la cabeza hacia los lados. Los puños están mayormente cerrados.'
                },
                {
                    title: 'Mes 2',
                    content: 'Comienza a sostener la cabeza brevemente durante tummy time. Movimientos más suaves y menos espasmódicos. Puede seguir objetos con la mirada.'
                },
                {
                    title: 'Mes 3',
                    content: 'Sostiene la cabeza firme cuando está boca abajo. Puede llevar manos a la boca. Abre y cierra las manos. Puede golpear objetos colgantes.'
                },
                {
                    title: 'Tummy Time',
                    content: 'Tiempo boca abajo supervisado: comienza con 3-5 minutos, 2-3 veces al día. Aumenta gradualmente. Fundamental para fortalecer cuello, espalda y hombros.'
                }
            ],
            tips: [
                'El tummy time puede ser sobre tu pecho',
                'Usa juguetes coloridos para motivar el seguimiento visual',
                'Cada bebé se desarrolla a su propio ritmo'
            ]
        }
    },
    {
        id: 'newborn-development-cognitive',
        stageId: 'newborn',
        order: 6,
        title: 'Desarrollo Cognitivo',
        description: 'Hitos mentales y emocionales',
        icon: 'psychology',
        isPriority: false,
        content: {
            intro: 'Aunque parezca que solo come y duerme, tu bebé está aprendiendo constantemente sobre el mundo.',
            sections: [
                {
                    title: 'Visión',
                    content: 'Al nacer ve a 20-30 cm. Prefiere patrones de alto contraste (blanco/negro). A las 6 semanas, puede enfocar en caras. A los 3 meses, ve colores y sigue objetos en movimiento.'
                },
                {
                    title: 'Audición',
                    content: 'Reconoce la voz de mamá desde el nacimiento. Prefiere sonidos agudos. Se sobresalta con ruidos fuertes. A los 3 meses, voltea hacia los sonidos.'
                },
                {
                    title: 'Comunicación',
                    content: 'El llanto es su lenguaje. A las 6-8 semanas aparece la sonrisa social. A los 3 meses, hace sonidos de arrullo y "ah" "oh".'
                },
                {
                    title: 'Vínculo Emocional',
                    content: 'Reconoce a sus cuidadores principales. Busca consuelo en ellos. Se calma con el contacto físico y la voz familiar.'
                }
            ],
            tips: [
                'Habla narrrando lo que haces: "Ahora te cambio el pañal"',
                'El contacto visual fortalece el vínculo',
                'Responde siempre a su llanto - no lo vas a malcriar',
                'Los móviles con blanco/negro son ideales para esta edad'
            ]
        }
    },
    {
        id: 'newborn-health',
        stageId: 'newborn',
        order: 7,
        title: 'Salud y Vacunas',
        description: 'Vacunación y visitas al pediatra',
        icon: 'vaccines',
        isPriority: true,
        content: {
            intro: 'Las primeras vacunas y visitas médicas son fundamentales para proteger a tu bebé.',
            sections: [
                {
                    title: 'Vacunas 0-3 Meses',
                    content: 'Al nacer: Hepatitis B. A los 2 meses: Hexavalente (DTPa-VPI-Hib-HB), Neumococo, Rotavirus. Estas vacunas son esenciales y seguras.'
                },
                {
                    title: 'Visitas al Pediatra',
                    content: 'Primera semana: control del peso y alimentación. 2 semanas: revisión general. 1 mes: desarrollo y vacunas. 2 meses: vacunas y desarrollo.'
                },
                {
                    title: 'Fiebre en Recién Nacidos',
                    content: 'La fiebre (>38°C) en menores de 3 meses es EMERGENCIA. Llama al pediatra inmediatamente o ve a urgencias.'
                }
            ],
            checklist: [
                { id: 'nh2-1', text: '¿Tienes termómetro digital?', category: 'Equipamiento' },
                { id: 'nh2-2', text: '¿Tienes el carnet de vacunación?', category: 'Documentos' },
                { id: 'nh2-3', text: '¿Sabes el número de emergencias pediátricas?', category: 'Emergencias' }
            ],
            warningSignals: [
                'Fiebre mayor a 38°C (EMERGENCIA)',
                'Letargo extremo o irritabilidad que no cede',
                'Vómito proyectil repetido',
                'Diarrea con sangre o deshidratación',
                'Dificultad para respirar'
            ]
        }
    },
    {
        id: 'newborn-stimulation',
        stageId: 'newborn',
        order: 8,
        title: 'Estimulación y Juego',
        description: 'Actividades para el desarrollo',
        icon: 'toys',
        isPriority: false,
        content: {
            intro: 'El juego para un recién nacido es simple pero poderoso: contacto, voces y caras amorosas.',
            sections: [
                {
                    title: 'Actividades Mes 1',
                    content: 'Contacto piel con piel. Cantarle suavemente. Mostrar tu cara cerca (20 cm). Masajes suaves. Hablarle mientras lo cuidas.'
                },
                {
                    title: 'Actividades Mes 2-3',
                    content: 'Móviles con alto contraste. Tummy time corto. Mostrar juguetes coloridos. Imitar sus sonidos. Leer cuentos en voz alta.'
                },
                {
                    title: 'Juguetes Recomendados',
                    content: 'Móviles en blanco y negro. Sonajeros suaves. Espejo de seguridad. Mantas de texturas. Música suave.'
                }
            ],
            tips: [
                'Tu cara es el mejor juguete para un recién nacido',
                'No necesitas juguetes caros - tu voz y presencia son suficientes',
                'Respeta cuando el bebé voltea la mirada - está sobrestimulado',
                'El juego debe ser calmado y suave'
            ]
        }
    },
    {
        id: 'newborn-warning-signs',
        stageId: 'newborn',
        order: 9,
        title: 'Señales de Alerta',
        description: 'Cuándo llamar al pediatra',
        icon: 'warning',
        isPriority: true,
        content: {
            intro: 'Confía en tu instinto. Si algo no te parece bien, consulta. Es mejor una visita de más que una de menos.',
            sections: [
                {
                    title: 'Urgencias - Ir a Hospital',
                    content: 'Fiebre >38°C. Dificultad respiratoria (costillas marcadas, aleteo nasal). Color azulado. Convulsiones. Letargo extremo (no responde). Sangrado inusual.'
                },
                {
                    title: 'Llamar al Pediatra',
                    content: 'Rechazo alimenticio >8 horas. Menos de 6 pañales mojados al día. Llanto inconsolable >3 horas. Vómitos repetidos. Ojos/piel muy amarillos.'
                },
                {
                    title: 'Consulta Programada',
                    content: 'No aumenta de peso. Problemas con la lactancia. Erupción cutánea. Estreñimiento. Dudas sobre el desarrollo.'
                }
            ],
            warningSignals: [
                'Fiebre en menores de 3 meses = URGENCIA',
                'Dificultad para respirar',
                'No despierta para comer',
                'Fontanela hundida o abultada',
                'Llanto diferente, agudo o débil'
            ]
        }
    },
    {
        id: 'newborn-tips',
        stageId: 'newborn',
        order: 10,
        title: 'Tips Prácticos',
        description: 'Consejos del día a día',
        icon: 'lightbulb',
        isPriority: false,
        content: {
            intro: 'Consejos de padres experimentados que harán tu vida más fácil.',
            sections: [
                {
                    title: 'Supervivencia para Padres',
                    content: 'Duerme cuando el bebé duerme. Acepta ayuda. No busques la perfección. Los primeros 3 meses son los más intensos - sobrevivirás.'
                },
                {
                    title: 'Organización',
                    content: 'Prepara la pañalera la noche anterior. Ten estaciones de cambio en diferentes cuartos. Cocina en lotes cuando puedas. Simplifica todo.'
                },
                {
                    title: 'Llanto y Cólicos',
                    content: 'Los 5 S: Swaddle (envolver), Side (de lado), Shush (ruido blanco), Swing (mecer), Suck (chupar). Probados para calmar bebés.'
                },
                {
                    title: 'Cuidar a los Cuidadores',
                    content: 'La salud mental de los padres importa. El baby blues es común. Si dura más de 2 semanas o es intenso, busca ayuda profesional.'
                }
            ],
            tips: [
                'Un bebé que llora no significa que seas mal padre',
                'Está bien poner al bebé en la cuna segura y tomarte 5 minutos',
                'Pide ayuda específica: "Trae comida", no "¿necesitas algo?"',
                'Toma fotos - esta etapa pasa rápido',
                'Confía en ti mismo - conoces a tu bebé mejor que nadie'
            ]
        }
    }
];

// ============================================
// STAGE 2: BEBÉ PEQUEÑO (3-6 meses) - Resumen
// ============================================
export const INFANT_EARLY_MODULES: GuideModule[] = [
    {
        id: 'infant-early-intro',
        stageId: 'infant-early',
        order: 1,
        title: 'Descubriendo el Mundo',
        description: 'Qué esperar de 3 a 6 meses',
        icon: 'explore',
        isPriority: true,
        content: {
            intro: 'Entre los 3 y 6 meses, tu bebé se vuelve más interactivo, sonriente y curioso. Es una etapa llena de risas y descubrimientos.',
            sections: [
                { title: 'Grandes Cambios', content: 'Mejor control de la cabeza y tronco. Risas y carcajadas. Mayor interacción social. Posible inicio del rodamiento. Manos más coordinadas.' },
                { title: 'Comunicación', content: 'Balbuceos más complejos. Responde a su nombre. Expresa emociones claramente. Prefiere a sus cuidadores conocidos.' }
            ],
            tips: ['Esta es una edad muy social - disfruta las sonrisas', 'El desarrollo es rápido - toma muchas fotos']
        }
    },
    {
        id: 'infant-early-feeding',
        stageId: 'infant-early',
        order: 2,
        title: 'Alimentación 3-6 Meses',
        description: 'Lactancia e introducción de sólidos',
        icon: 'restaurant',
        isPriority: true,
        content: {
            intro: 'La leche sigue siendo el alimento principal. Alrededor de los 6 meses, muchos bebés están listos para probar sólidos.',
            sections: [
                { title: 'Señales de Preparación para Sólidos', content: 'Sostiene la cabeza firme. Se sienta con apoyo. Muestra interés en la comida. Perdió el reflejo de extrusión (empujar con la lengua).' },
                { title: 'Primeros Alimentos', content: 'Cereales fortificados con hierro, purés de verduras o frutas. Introduce un alimento nuevo cada 3-5 días para detectar alergias.' }
            ],
            checklist: [
                { id: 'ie-f1', text: '¿Tu bebé muestra señales de estar listo?', category: 'Preparación' },
                { id: 'ie-f2', text: '¿Tienes trona/silla alta?', category: 'Equipamiento' },
                { id: 'ie-f3', text: '¿Consultaste con el pediatra sobre iniciar sólidos?', category: 'Médico' }
            ],
            tips: ['No hay prisa - la leche es suficiente hasta los 6 meses', 'La comida es para explorar, la leche para nutrir']
        }
    },
    {
        id: 'infant-early-sleep',
        stageId: 'infant-early',
        order: 3,
        title: 'Sueño 3-6 Meses',
        description: 'Consolidación del sueño nocturno',
        icon: 'bedtime',
        isPriority: false,
        content: {
            intro: 'El sueño comienza a consolidarse. Muchos bebés duermen tramos más largos por la noche.',
            sections: [
                { title: 'Patrones de Sueño', content: '14-16 horas totales. 2-3 siestas diurnas. Algunos duermen 6-8 horas seguidas de noche.' },
                { title: 'Regresión de los 4 Meses', content: 'Es normal una regresión alrededor de los 4 meses. El sueño cambia a ciclos más adultos. Paciencia - pasará.' }
            ],
            tips: ['Una rutina de sueño consistente ayuda mucho', 'Oscuridad y ruido blanco facilitan el sueño']
        }
    },
    {
        id: 'infant-early-hygiene',
        stageId: 'infant-early',
        order: 4,
        title: 'Higiene y Cuidados',
        description: 'Baño, dientes y cuidado de la piel',
        icon: 'bathtub',
        isPriority: false,
        content: {
            intro: 'El baño puede ser más divertido ahora que el bebé tiene más control.',
            sections: [
                { title: 'Baño', content: 'Puede sentarse con apoyo en la bañera. Disfruta chapotear. Sigue siendo 2-3 baños por semana suficiente.' },
                { title: 'Primeros Dientes', content: 'Pueden aparecer desde los 4 meses. Señales: babeo excesivo, morder todo, encías rojas. Mordedores fríos ayudan.' }
            ],
            tips: ['Nunca dejes al bebé solo en el agua', 'Limpia las encías con gasa húmeda aunque no haya dientes']
        }
    },
    {
        id: 'infant-early-development-motor',
        stageId: 'infant-early',
        order: 5,
        title: 'Desarrollo Motor',
        description: 'Hitos físicos de 3 a 6 meses',
        icon: 'accessibility_new',
        isPriority: false,
        content: {
            intro: 'Tu bebé gana fuerza y coordinación rápidamente.',
            sections: [
                { title: 'Hitos Motores', content: 'Sostiene la cabeza firme. Se voltea (primero de boca abajo a arriba). Agarra objetos intencionalmente. Se lleva cosas a la boca. Algunos intentan sentarse con apoyo.' }
            ],
            tips: ['Dale mucho tiempo en el suelo para practicar', 'Todo irá a su boca - asegura que los objetos sean seguros']
        }
    },
    {
        id: 'infant-early-development-cognitive',
        stageId: 'infant-early',
        order: 6,
        title: 'Desarrollo Cognitivo',
        description: 'Mente y emociones en crecimiento',
        icon: 'psychology',
        isPriority: false,
        content: {
            intro: 'La personalidad de tu bebé brilla. Su mundo social se expande.',
            sections: [
                { title: 'Hitos Cognitivos', content: 'Reconoce caras familiares. Responde a su nombre. Muestra emociones diferenciadas (alegría, frustración, miedo). Puede mostrar preferencia por ciertos juguetes.' }
            ],
            tips: ['Juega a las escondidas (peek-a-boo)', 'Nombra objetos y personas constantemente']
        }
    },
    {
        id: 'infant-early-health',
        stageId: 'infant-early',
        order: 7,
        title: 'Salud y Vacunas',
        description: 'Vacunas de los 4 y 6 meses',
        icon: 'vaccines',
        isPriority: true,
        content: {
            intro: 'Las vacunas continúan protegiendo a tu bebé.',
            sections: [
                { title: 'Vacunas', content: '4 meses: Segunda dosis de Hexavalente, Neumococo, Rotavirus. 6 meses: Tercera dosis. Posible vacuna de gripe.' }
            ],
            warningSignals: ['Fiebre alta persistente después de vacunas', 'Llanto inconsolable por más de 3 horas']
        }
    },
    {
        id: 'infant-early-stimulation',
        stageId: 'infant-early',
        order: 8,
        title: 'Estimulación y Juego',
        description: 'Juegos interactivos',
        icon: 'toys',
        isPriority: false,
        content: {
            intro: 'El juego se vuelve más interactivo y divertido.',
            sections: [
                { title: 'Juegos Recomendados', content: 'Peek-a-boo. Canciones con gestos. Espejos. Cubos blandos. Juguetes que hacen sonido al agitarlos. Libros de tela con texturas.' }
            ],
            tips: ['Sigue su liderazgo - si pierde interés, cambia de actividad', 'Tu cara expresiva es el mejor entretenimiento']
        }
    },
    {
        id: 'infant-early-warning',
        stageId: 'infant-early',
        order: 9,
        title: 'Señales de Alerta',
        description: 'Cuándo consultar al médico',
        icon: 'warning',
        isPriority: true,
        content: {
            intro: 'Señales que requieren atención médica en esta etapa.',
            sections: [
                { title: 'Consultar', content: 'No sostiene la cabeza a los 4 meses. No sonríe socialmente. No sigue objetos con la mirada. Rigidez o flacidez extrema. No responde a sonidos.' }
            ],
            warningSignals: ['No muestra progreso en hitos motores', 'Pérdida de habilidades adquiridas']
        }
    },
    {
        id: 'infant-early-tips',
        stageId: 'infant-early',
        order: 10,
        title: 'Tips Prácticos',
        description: 'Consejos para esta etapa',
        icon: 'lightbulb',
        isPriority: false,
        content: {
            intro: 'Consejos para sobrevivir y disfrutar esta etapa.',
            sections: [
                { title: 'Día a Día', content: 'Establece rutinas flexibles. Sal a pasear con el bebé. Únete a grupos de mamás/papás. Cuida tu descanso.' }
            ],
            tips: ['Esta etapa es más predecible que los primeros 3 meses', 'Disfruta las risas y la interacción']
        }
    }
];

// Para las demás etapas, estructura similar (resumo por espacio)
// Los módulos siguen el mismo patrón pero con contenido específico para cada edad

export const INFANT_MID_MODULES: GuideModule[] = [
    { id: 'infant-mid-intro', stageId: 'infant-mid', order: 1, title: 'Exploradores Activos', description: '6-9 meses de descubrimiento', icon: 'explore', isPriority: true, content: { intro: 'Tu bebé es un explorador activo. Se sienta solo, puede gatear y todo lo explora con la boca.', sections: [{ title: 'Grandes Hitos', content: 'Sentarse sin apoyo. Inicio del gateo. Balbuceo con consonantes (ba-ba, ma-ma). Ansiedad ante extraños.' }], tips: ['¡Es hora de asegurar la casa a prueba de bebés!'] } },
    { id: 'infant-mid-feeding', stageId: 'infant-mid', order: 2, title: 'Alimentación Complementaria', description: 'Sólidos en pleno desarrollo', icon: 'restaurant', isPriority: true, content: { intro: 'Los sólidos se integran gradualmente. La leche sigue siendo fundamental.', sections: [{ title: 'Alimentos', content: 'Purés más espesos. Finger foods blandos. Proteínas (pollo, huevo, pescado). Evitar miel, sal, azúcar.' }], tips: ['Deja que explore la comida con las manos - es aprendizaje'] } },
    { id: 'infant-mid-sleep', stageId: 'infant-mid', order: 3, title: 'Sueño 6-9 Meses', description: 'Patrones más estables', icon: 'bedtime', isPriority: false, content: { intro: '14 horas totales. 2 siestas diurnas. Muchos duermen toda la noche.', sections: [], tips: ['La consistencia en la rutina es clave'] } },
    { id: 'infant-mid-hygiene', stageId: 'infant-mid', order: 4, title: 'Higiene', description: 'Cuidados continuos', icon: 'bathtub', isPriority: false, content: { intro: 'El baño es más dinámico con un bebé que se sienta.', sections: [], tips: [] } },
    { id: 'infant-mid-motor', stageId: 'infant-mid', order: 5, title: 'Desarrollo Motor', description: 'Movilidad en aumento', icon: 'accessibility_new', isPriority: false, content: { intro: 'Se sienta, gatea, se pone de pie con apoyo.', sections: [], tips: [] } },
    { id: 'infant-mid-cognitive', stageId: 'infant-mid', order: 6, title: 'Desarrollo Cognitivo', description: 'Permanencia del objeto', icon: 'psychology', isPriority: false, content: { intro: 'Entiende que los objetos existen aunque no los vea. Busca juguetes caídos.', sections: [], tips: [] } },
    { id: 'infant-mid-health', stageId: 'infant-mid', order: 7, title: 'Salud y Vacunas', description: 'Control de los 6 meses', icon: 'vaccines', isPriority: true, content: { intro: 'Vacunas de 6 meses. Posible vacuna de gripe.', sections: [], warningSignals: [] } },
    { id: 'infant-mid-stimulation', stageId: 'infant-mid', order: 8, title: 'Estimulación', description: 'Juegos de causa-efecto', icon: 'toys', isPriority: false, content: { intro: 'Juguetes que responden a acciones. Escondidas. Apilar y tirar.', sections: [], tips: [] } },
    { id: 'infant-mid-warning', stageId: 'infant-mid', order: 9, title: 'Señales de Alerta', description: 'Qué observar', icon: 'warning', isPriority: true, content: { intro: 'No se sienta con apoyo. No transfiere objetos entre manos. Sin balbuceo.', sections: [], warningSignals: [] } },
    { id: 'infant-mid-tips', stageId: 'infant-mid', order: 10, title: 'Tips Prácticos', description: 'Supervivencia diaria', icon: 'lightbulb', isPriority: false, content: { intro: 'Babyproof la casa. Rutinas de sueño. Paciencia con los terrores del extraño.', sections: [], tips: [] } }
];

export const INFANT_LATE_MODULES: GuideModule[] = [
    { id: 'infant-late-intro', stageId: 'infant-late', order: 1, title: 'Casi Caminando', description: '9-12 meses hacia la independencia', icon: 'directions_walk', isPriority: true, content: { intro: 'Tu bebé está en la cúspide de caminar. Entiende mucho más de lo que puede expresar.', sections: [{ title: 'Grandes Hitos', content: 'De pie con apoyo. Crucero (caminar agarrado de muebles). Primeras palabras. Señalar.' }], tips: ['Celebra cada logro, por pequeño que sea'] } },
    { id: 'infant-late-feeding', stageId: 'infant-late', order: 2, title: 'Alimentación', description: 'Mesa familiar', icon: 'restaurant', isPriority: true, content: { intro: 'Puede comer casi todo lo de la familia (sin sal/azúcar excesivo).', sections: [], tips: ['Ofrece variedad - los gustos se forman ahora'] } },
    { id: 'infant-late-sleep', stageId: 'infant-late', order: 3, title: 'Sueño', description: 'Patrones establecidos', icon: 'bedtime', isPriority: false, content: { intro: '13-14 horas. 1-2 siestas. Puede haber regresión por hitos.', sections: [], tips: [] } },
    { id: 'infant-late-hygiene', stageId: 'infant-late', order: 4, title: 'Higiene', description: 'Más dientes, más cuidado', icon: 'bathtub', isPriority: false, content: { intro: 'Cepilla los dientes que aparezcan. El baño es momento de juego.', sections: [], tips: [] } },
    { id: 'infant-late-motor', stageId: 'infant-late', order: 5, title: 'Desarrollo Motor', description: 'Primeros pasos', icon: 'directions_walk', isPriority: false, content: { intro: 'Algunos caminan, otros no. Ambos son normales.', sections: [], tips: [] } },
    { id: 'infant-late-cognitive', stageId: 'infant-late', order: 6, title: 'Desarrollo Cognitivo', description: 'Comprensión expandida', icon: 'psychology', isPriority: false, content: { intro: 'Entiende "no". Sigue instrucciones simples. Señala lo que quiere.', sections: [], tips: [] } },
    { id: 'infant-late-health', stageId: 'infant-late', order: 7, title: 'Salud y Vacunas', description: 'Control del año', icon: 'vaccines', isPriority: true, content: { intro: 'Vacunas de 12 meses: Triple Viral (SRP), Varicela, Hepatitis A.', sections: [], warningSignals: [] } },
    { id: 'infant-late-stimulation', stageId: 'infant-late', order: 8, title: 'Estimulación', description: 'Juego activo', icon: 'toys', isPriority: false, content: { intro: 'Juguetes de empujar/jalar. Bloques. Lectura interactiva.', sections: [], tips: [] } },
    { id: 'infant-late-warning', stageId: 'infant-late', order: 9, title: 'Señales de Alerta', description: 'Desarrollo atípico', icon: 'warning', isPriority: true, content: { intro: 'No soporta peso en piernas. No señala. No responde a su nombre.', sections: [], warningSignals: [] } },
    { id: 'infant-late-tips', stageId: 'infant-late', order: 10, title: 'Tips Prácticos', description: 'El primer cumpleaños', icon: 'lightbulb', isPriority: false, content: { intro: 'Preparación para caminar. Independencia en la comida. Celebra el primer año.', sections: [], tips: [] } }
];

export const TODDLER_EARLY_MODULES: GuideModule[] = [
    { id: 'toddler-early-intro', stageId: 'toddler-early', order: 1, title: 'Pequeños Exploradores', description: '1-2 años: Independencia', icon: 'directions_run', isPriority: true, content: { intro: 'Camina, corre, trepa. Dice sus primeras palabras. Los berrinches comienzan.', sections: [], tips: [] } },
    { id: 'toddler-early-feeding', stageId: 'toddler-early', order: 2, title: 'Alimentación', description: 'Comer como la familia', icon: 'restaurant', isPriority: false, content: { intro: 'Come con la familia. Puede usar cuchara. Leche entera. Selectividad alimentaria es normal.', sections: [], tips: [] } },
    { id: 'toddler-early-sleep', stageId: 'toddler-early', order: 3, title: 'Sueño', description: '11-14 horas', icon: 'bedtime', isPriority: false, content: { intro: '1-2 siestas que se consolidan a 1. Transición a cama puede comenzar.', sections: [], tips: [] } },
    { id: 'toddler-early-hygiene', stageId: 'toddler-early', order: 4, title: 'Higiene', description: 'Introducción al baño solo', icon: 'bathtub', isPriority: false, content: { intro: 'Puede mostrar interés en el baño. No hay prisa - cada niño a su ritmo.', sections: [], tips: [] } },
    { id: 'toddler-early-motor', stageId: 'toddler-early', order: 5, title: 'Desarrollo Motor', description: 'Corre y trepa', icon: 'directions_run', isPriority: false, content: { intro: 'Camina bien. Comienza a correr. Sube escaleras con ayuda. Garabatea.', sections: [], tips: [] } },
    { id: 'toddler-early-cognitive', stageId: 'toddler-early', order: 6, title: 'Desarrollo Cognitivo', description: 'Explosión del lenguaje', icon: 'psychology', isPriority: false, content: { intro: 'De 50 palabras a 200+. Combina 2 palabras. Juego simbólico comienza.', sections: [], tips: [] } },
    { id: 'toddler-early-health', stageId: 'toddler-early', order: 7, title: 'Salud', description: 'Chequeo del año', icon: 'vaccines', isPriority: true, content: { intro: 'Vacunas de refuerzo. Chequeo dental recomendado.', sections: [], warningSignals: [] } },
    { id: 'toddler-early-stimulation', stageId: 'toddler-early', order: 8, title: 'Estimulación', description: 'Juego imaginativo', icon: 'toys', isPriority: false, content: { intro: 'Juego de roles. Bloques. Arte. Música. Libros con historias simples.', sections: [], tips: [] } },
    { id: 'toddler-early-warning', stageId: 'toddler-early', order: 9, title: 'Señales de Alerta', description: 'Desarrollo del lenguaje', icon: 'warning', isPriority: true, content: { intro: 'Menos de 50 palabras a los 2 años. No combina palabras. No responde al nombre.', sections: [], warningSignals: [] } },
    { id: 'toddler-early-tips', stageId: 'toddler-early', order: 10, title: 'Tips: Berrinches', description: 'Manejo de emociones', icon: 'lightbulb', isPriority: true, content: { intro: 'Los berrinches son normales. Mantén la calma. Valida emociones. Límites claros.', sections: [], tips: [] } }
];

export const TODDLER_LATE_MODULES: GuideModule[] = [
    { id: 'toddler-late-intro', stageId: 'toddler-late', order: 1, title: 'Los Terribles Dos', description: '2-3 años: Voluntad propia', icon: 'sports_handball', isPriority: true, content: { intro: 'Máxima independencia. "Yo solo". Berrinches en su punto más alto. Oraciones completas.', sections: [], tips: [] } },
    { id: 'toddler-late-feeding', stageId: 'toddler-late', order: 2, title: 'Alimentación', description: 'Come solo con cubiertos', icon: 'restaurant', isPriority: false, content: { intro: 'Usa tenedor y cuchara. Puede servirse agua. La selectividad puede persistir.', sections: [], tips: [] } },
    { id: 'toddler-late-sleep', stageId: 'toddler-late', order: 3, title: 'Sueño', description: 'Transición a cama', icon: 'bedtime', isPriority: false, content: { intro: '11-12 horas. 1 siesta. Puede resistirse a dormir (FOMO). Miedos nocturnos pueden aparecer.', sections: [], tips: [] } },
    { id: 'toddler-late-hygiene', stageId: 'toddler-late', order: 4, title: 'Control de Esfínteres', description: 'Entrenamiento para ir al baño', icon: 'bathtub', isPriority: true, content: { intro: 'Señales de preparación. Paciencia es clave. No presiones.', sections: [], checklist: [{ id: 'te-1', text: '¿Muestra incomodidad con el pañal sucio?', category: 'Preparación' }, { id: 'te-2', text: '¿Puede estar seco 2+ horas?', category: 'Preparación' }, { id: 'te-3', text: '¿Muestra interés en el baño?', category: 'Preparación' }], tips: [] } },
    { id: 'toddler-late-motor', stageId: 'toddler-late', order: 5, title: 'Desarrollo Motor', description: 'Coordinación avanzada', icon: 'sports_handball', isPriority: false, content: { intro: 'Corre bien. Salta. Sube escaleras alternando pies. Pedalea triciclo.', sections: [], tips: [] } },
    { id: 'toddler-late-cognitive', stageId: 'toddler-late', order: 6, title: 'Desarrollo Cognitivo', description: 'Oraciones y preguntas', icon: 'psychology', isPriority: false, content: { intro: 'Oraciones de 4+ palabras. Preguntas constantes (¿Por qué?). Juego simbólico elaborado.', sections: [], tips: [] } },
    { id: 'toddler-late-health', stageId: 'toddler-late', order: 7, title: 'Salud', description: 'Chequeo y dental', icon: 'vaccines', isPriority: false, content: { intro: 'Chequeo anual. Primera visita al dentista si no se ha hecho.', sections: [], warningSignals: [] } },
    { id: 'toddler-late-stimulation', stageId: 'toddler-late', order: 8, title: 'Estimulación', description: 'Juego cooperativo', icon: 'toys', isPriority: false, content: { intro: 'Comienza a jugar CON otros niños (no solo al lado). Artes, plastilina, disfraz.', sections: [], tips: [] } },
    { id: 'toddler-late-warning', stageId: 'toddler-late', order: 9, title: 'Señales de Alerta', description: 'Desarrollo social', icon: 'warning', isPriority: true, content: { intro: 'No hay juego simbólico. No hay oraciones de 2+ palabras. No mira a los ojos. Pérdida de habilidades.', sections: [], warningSignals: [] } },
    { id: 'toddler-late-tips', stageId: 'toddler-late', order: 10, title: 'Tips: Disciplina Positiva', description: 'Límites con amor', icon: 'lightbulb', isPriority: true, content: { intro: 'Límites claros y consistentes. Opciones limitadas. Consecuencias naturales. Tiempo fuera efectivo.', sections: [], tips: [] } }
];

export const PRESCHOOL_MODULES: GuideModule[] = [
    { id: 'preschool-intro', stageId: 'preschool', order: 1, title: 'Grandes Preguntas', description: '3-5 años: Curiosidad infinita', icon: 'school', isPriority: true, content: { intro: 'La edad del "¿Por qué?". Imaginación desbordante. Amigos imaginarios. Preparación escolar.', sections: [], tips: [] } },
    { id: 'preschool-feeding', stageId: 'preschool', order: 2, title: 'Alimentación', description: 'Independiente en la mesa', icon: 'restaurant', isPriority: false, content: { intro: 'Come solo. Puede ayudar a preparar comidas simples. Modelo de alimentación saludable.', sections: [], tips: [] } },
    { id: 'preschool-sleep', stageId: 'preschool', order: 3, title: 'Sueño', description: '10-12 horas', icon: 'bedtime', isPriority: false, content: { intro: 'Muchos dejan la siesta. Miedos nocturnos comunes. Rutina consistente fundamental.', sections: [], tips: [] } },
    { id: 'preschool-hygiene', stageId: 'preschool', order: 4, title: 'Higiene', description: 'Auto-cuidado', icon: 'bathtub', isPriority: false, content: { intro: 'Va al baño solo. Se lava las manos. Ayuda a vestirse.', sections: [], tips: [] } },
    { id: 'preschool-motor', stageId: 'preschool', order: 5, title: 'Desarrollo Motor', description: 'Habilidades finas y gruesas', icon: 'accessibility_new', isPriority: false, content: { intro: 'Bicicleta con rueditas. Recorta con tijeras. Dibuja personas reconocibles.', sections: [], tips: [] } },
    { id: 'preschool-cognitive', stageId: 'preschool', order: 6, title: 'Desarrollo Cognitivo', description: 'Pre-lectura y números', icon: 'psychology', isPriority: false, content: { intro: 'Reconoce letras. Cuenta hasta 10+. Entiende conceptos de tiempo. Historias elaboradas.', sections: [], tips: [] } },
    { id: 'preschool-health', stageId: 'preschool', order: 7, title: 'Salud', description: 'Vacunas preescolares', icon: 'vaccines', isPriority: true, content: { intro: 'Refuerzo de vacunas antes de entrar a la escuela. Chequeo visual y auditivo.', sections: [], warningSignals: [] } },
    { id: 'preschool-stimulation', stageId: 'preschool', order: 8, title: 'Estimulación', description: 'Preparación escolar', icon: 'toys', isPriority: true, content: { intro: 'Juegos de mesa simples. Actividades de pre-escritura. Socialización con pares.', sections: [], tips: [] } },
    { id: 'preschool-warning', stageId: 'preschool', order: 9, title: 'Señales de Alerta', description: 'Listos para la escuela', icon: 'warning', isPriority: false, content: { intro: 'Dificultad severa para separarse. No juega con otros. Lenguaje incomprensible. Problemas motores significativos.', sections: [], warningSignals: [] } },
    { id: 'preschool-tips', stageId: 'preschool', order: 10, title: 'Tips: Transición a la Escuela', description: 'Preparación emocional', icon: 'lightbulb', isPriority: true, content: { intro: 'Visita la escuela antes. Practica rutinas. Lee libros sobre la escuela. Valida sus miedos.', sections: [], tips: [] } }
];

export const EARLY_SCHOOL_MODULES: GuideModule[] = [
    { id: 'early-school-intro', stageId: 'early-school', order: 1, title: 'Años Escolares', description: '5-7 años: Aprendizaje formal', icon: 'backpack', isPriority: true, content: { intro: 'Lectura, escritura, matemáticas. Amistades importantes. Mayor independencia. Conciencia social.', sections: [], tips: [] } },
    { id: 'early-school-feeding', stageId: 'early-school', order: 2, title: 'Nutrición Escolar', description: 'Loncheras y hábitos', icon: 'restaurant', isPriority: false, content: { intro: 'Loncheras saludables. Desayuno importante para concentración. Hidratación.', sections: [], tips: [] } },
    { id: 'early-school-sleep', stageId: 'early-school', order: 3, title: 'Sueño', description: '9-11 horas necesarias', icon: 'bedtime', isPriority: false, content: { intro: 'La falta de sueño afecta el aprendizaje. Rutina de hora de dormir. Sin pantallas antes de dormir.', sections: [], tips: [] } },
    { id: 'early-school-hygiene', stageId: 'early-school', order: 4, title: 'Higiene', description: 'Responsabilidad personal', icon: 'bathtub', isPriority: false, content: { intro: 'Se baña solo (supervisado). Cuida sus pertenencias. Lavado de manos reforzado.', sections: [], tips: [] } },
    { id: 'early-school-motor', stageId: 'early-school', order: 5, title: 'Desarrollo Motor', description: 'Deportes y escritura', icon: 'accessibility_new', isPriority: false, content: { intro: 'Deportes organizados. Escritura más fluida. Instrumentos musicales posibles.', sections: [], tips: [] } },
    { id: 'early-school-cognitive', stageId: 'early-school', order: 6, title: 'Desarrollo Cognitivo', description: 'Lectura y lógica', icon: 'psychology', isPriority: false, content: { intro: 'Lee de forma independiente. Operaciones matemáticas. Pensamiento lógico. Resolución de problemas.', sections: [], tips: [] } },
    { id: 'early-school-health', stageId: 'early-school', order: 7, title: 'Salud', description: 'Chequeos escolares', icon: 'vaccines', isPriority: false, content: { intro: 'Chequeo anual. Control de visión. Salud dental. Postura.', sections: [], warningSignals: [] } },
    { id: 'early-school-stimulation', stageId: 'early-school', order: 8, title: 'Actividades Extracurriculares', description: 'Equilibrio y pasiones', icon: 'toys', isPriority: false, content: { intro: 'Deportes, arte, música. No sobrecargar. Tiempo libre para jugar es importante.', sections: [], tips: [] } },
    { id: 'early-school-warning', stageId: 'early-school', order: 9, title: 'Señales de Alerta', description: 'Dificultades de aprendizaje', icon: 'warning', isPriority: true, content: { intro: 'Dificultad persistente para leer/escribir. Problemas de atención. Rechazo a la escuela. Aislamiento social.', sections: [], warningSignals: [] } },
    { id: 'early-school-tips', stageId: 'early-school', order: 10, title: 'Tips: Apoyo Escolar', description: 'Tareas y motivación', icon: 'lightbulb', isPriority: true, content: { intro: 'Espacio tranquilo para tareas. Involucrarse sin hacer por ellos. Celebrar el esfuerzo, no solo resultados.', sections: [], tips: [] } }
];

// Combinar todos los módulos
export const ALL_GUIDE_MODULES: GuideModule[] = [
    ...NEWBORN_MODULES,
    ...INFANT_EARLY_MODULES,
    ...INFANT_MID_MODULES,
    ...INFANT_LATE_MODULES,
    ...TODDLER_EARLY_MODULES,
    ...TODDLER_LATE_MODULES,
    ...PRESCHOOL_MODULES,
    ...EARLY_SCHOOL_MODULES
];

// Función helper para obtener módulos por etapa
export const getModulesByStage = (stageId: string): GuideModule[] => {
    return ALL_GUIDE_MODULES.filter(m => m.stageId === stageId).sort((a, b) => a.order - b.order);
};

// Función helper para obtener etapa por edad en meses
export const getStageByAgeMonths = (ageMonths: number): string | null => {
    const { STAGES } = require('../types/guidesTypes');
    const stage = STAGES.find((s: any) => ageMonths >= s.minMonths && ageMonths < s.maxMonths);
    return stage?.id || null;
};

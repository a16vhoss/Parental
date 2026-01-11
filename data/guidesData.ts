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
    {
        id: 'infant-mid-intro',
        stageId: 'infant-mid',
        order: 1,
        title: 'Exploradores Activos',
        description: '6-9 meses de descubrimiento',
        icon: 'explore',
        isPriority: true,
        content: {
            intro: 'Tu bebé es un explorador activo. Se sienta solo, puede gatear y todo lo explora con la boca. Esta es una etapa de grandes avances motores y cognitivos.',
            sections: [
                { title: 'Grandes Hitos', content: 'Sentarse sin apoyo. Inicio del gateo (algunos lo saltan). Balbuceo con consonantes (ba-ba, ma-ma, da-da). Ansiedad ante extraños - es señal de apego saludable.' },
                { title: 'Desarrollo Social', content: 'Reconoce caras familiares vs extraños. Puede llorar cuando mamá o papá se van. Responde a su nombre. Muestra preferencias claras por ciertas personas y juguetes.' },
                { title: 'Alimentación y Sueño', content: 'Los sólidos se vuelven parte importante de la dieta. El sueño se consolida en patrones más predecibles. Muchos duermen toda la noche.' }
            ],
            tips: [
                '¡Es hora de asegurar la casa a prueba de bebés!',
                'La ansiedad por separación es normal y saludable',
                'Todo irá a la boca - asegúrate de que sea seguro',
                'El gateo fortalece músculos para caminar'
            ]
        }
    },
    {
        id: 'infant-mid-feeding',
        stageId: 'infant-mid',
        order: 2,
        title: 'Alimentación Complementaria',
        description: 'Sólidos en pleno desarrollo',
        icon: 'restaurant',
        isPriority: true,
        content: {
            intro: 'Los sólidos se integran gradualmente. La leche sigue siendo fundamental, pero los alimentos complementarios aportan nutrientes importantes como hierro y zinc.',
            sections: [
                { title: 'Alimentos Recomendados', content: 'Purés más espesos y con textura. Finger foods blandos (plátano, aguacate, zanahoria cocida). Proteínas: pollo desmenuzado, huevo revuelto, pescado sin espinas. Cereales fortificados.' },
                { title: 'Alimentos a Evitar', content: 'Miel (hasta 12 meses por riesgo de botulismo). Sal y azúcar añadidas. Alimentos duros o redondos (riesgo de atragantamiento). Leche de vaca como bebida principal.' },
                { title: 'Baby-Led Weaning vs Purés', content: 'Ambos métodos son válidos. BLW permite que el bebé explore texturas por sí mismo. Los purés son tradicionales y seguros. Puedes combinar ambos enfoques.' }
            ],
            checklist: [
                { id: 'imf-1', text: '¿Tienes silla alta con arnés?', category: 'Equipamiento' },
                { id: 'imf-2', text: '¿Conoces los alimentos alergénicos comunes?', category: 'Conocimiento' },
                { id: 'imf-3', text: '¿Sabes hacer la maniobra de Heimlich para bebés?', category: 'Seguridad' }
            ],
            tips: [
                'Deja que explore la comida con las manos - es aprendizaje',
                'No te estreses si "juega" con la comida más que comerla',
                'Introduce alérgenos uno a la vez y observa',
                'El desorden es parte del proceso'
            ]
        }
    },
    {
        id: 'infant-mid-sleep',
        stageId: 'infant-mid',
        order: 3,
        title: 'Sueño 6-9 Meses',
        description: 'Patrones más estables',
        icon: 'bedtime',
        isPriority: false,
        content: {
            intro: '14 horas totales. 2 siestas diurnas (mañana y tarde). Muchos bebés duermen toda la noche a esta edad, pero las regresiones son normales.',
            sections: [
                { title: 'Patrones Típicos', content: '10-11 horas de sueño nocturno. 2 siestas de 1-2 horas cada una. Algunos bebés aún despiertan para comer de noche - es normal.' },
                { title: 'Regresión de los 8 Meses', content: 'Puede haber una regresión por ansiedad de separación, nuevos hitos motores, o dentición. Mantén la rutina y pasará.' },
                { title: 'Rutina de Sueño', content: 'Baño, pijama, cuento/canción, despedida. La consistencia es más importante que la hora exacta.' }
            ],
            tips: [
                'La consistencia en la rutina es clave',
                'Un objeto de transición (peluche seguro) puede ayudar',
                'Si gatea en la cuna, practica durante el día',
                'Evita crear nuevas asociaciones de sueño si funcionaba bien'
            ]
        }
    },
    {
        id: 'infant-mid-hygiene',
        stageId: 'infant-mid',
        order: 4,
        title: 'Higiene',
        description: 'Cuidados continuos',
        icon: 'bathtub',
        isPriority: false,
        content: {
            intro: 'El baño es más dinámico con un bebé que se sienta. Los dientes empiezan a aparecer y requieren cuidado.',
            sections: [
                { title: 'Hora del Baño', content: 'Puede sentarse en la bañera con supervisión. Usa juguetes flotantes para hacer el baño divertido. Nunca lo dejes solo, ni un segundo.' },
                { title: 'Cuidado Dental', content: 'Limpia los dientes que aparezcan con cepillo suave y agua. La primera visita al dentista se recomienda cuando sale el primer diente o al cumplir 1 año.' },
                { title: 'Cambio de Pañal', content: 'Más desafiante con un bebé que se mueve. Ten todo listo antes de empezar. Distráelo con un juguete si se resiste.' }
            ],
            tips: [
                'El agua debe cubrir solo hasta la cintura cuando se sienta',
                'Usa pasta sin flúor hasta los 2 años',
                'Lava las manos antes y después de las comidas'
            ]
        }
    },
    {
        id: 'infant-mid-motor',
        stageId: 'infant-mid',
        order: 5,
        title: 'Desarrollo Motor',
        description: 'Movilidad en aumento',
        icon: 'accessibility_new',
        isPriority: false,
        content: {
            intro: 'Se sienta, gatea, se pone de pie con apoyo. Tu bebé está ganando independencia motora rápidamente.',
            sections: [
                { title: 'Sentarse', content: 'A los 6-7 meses, se sienta sin apoyo. Usa las manos para equilibrarse. Gradualmente se sienta de forma más estable.' },
                { title: 'Gateo', content: 'Típicamente entre 7-10 meses. Algunos gatean hacia atrás primero. Algunos se arrastran de pancita. Algunos saltan el gateo y van directo a caminar.' },
                { title: 'Ponerse de Pie', content: 'Se jala para pararse agarrado de muebles. Puede hacer "cruising" (caminar agarrado de los muebles). Fortalece las piernas para caminar.' },
                { title: 'Motricidad Fina', content: 'Agarre de pinza (pulgar e índice) se desarrolla. Transfiere objetos entre manos. Puede aplaudir y hacer "adiós".' }
            ],
            tips: [
                'Dale mucho espacio en el piso para explorar',
                'Los andadores no son recomendados - retrasan el caminar',
                'No te preocupes si no gatea - cada bebé es diferente'
            ]
        }
    },
    {
        id: 'infant-mid-cognitive',
        stageId: 'infant-mid',
        order: 6,
        title: 'Desarrollo Cognitivo',
        description: 'Permanencia del objeto',
        icon: 'psychology',
        isPriority: false,
        content: {
            intro: 'Entiende que los objetos existen aunque no los vea. Busca juguetes caídos. Su capacidad de memoria y resolución de problemas crece.',
            sections: [
                { title: 'Permanencia del Objeto', content: 'Gran hito cognitivo: comprende que las cosas existen aunque no las vea. Por eso las escondidas son tan divertidas ahora.' },
                { title: 'Causa y Efecto', content: 'Entiende que sus acciones tienen consecuencias. Tira cosas para verlas caer. Presiona botones para escuchar sonidos.' },
                { title: 'Comunicación', content: 'Balbuceo con más consonantes. Puede entender "no" y otras palabras simples. Usa gestos para comunicarse.' }
            ],
            tips: [
                'Juega a las escondidas para reforzar la permanencia del objeto',
                'Nombra los objetos que señala',
                'Responde a su balbuceo como si fuera conversación'
            ]
        }
    },
    {
        id: 'infant-mid-health',
        stageId: 'infant-mid',
        order: 7,
        title: 'Salud y Vacunas',
        description: 'Control de los 6 meses',
        icon: 'vaccines',
        isPriority: true,
        content: {
            intro: 'Vacunas de 6 meses. Posible primera vacuna de gripe. Chequeo de desarrollo.',
            sections: [
                { title: 'Vacunas de 6 Meses', content: 'Tercera dosis de: Hexavalente, Neumococo, Rotavirus (última dosis). Primera dosis de vacuna de gripe si es temporada.' },
                { title: 'Visita al Pediatra', content: 'Control de peso, talla y perímetro cefálico. Evaluación de hitos del desarrollo. Discusión sobre alimentación complementaria.' },
                { title: 'Dentición', content: 'Los primeros dientes suelen aparecer entre 4-7 meses. Puede causar babeo, irritabilidad, encías rojas. Mordedores fríos y masajear las encías ayuda.' }
            ],
            warningSignals: [
                'No se sienta con apoyo a los 9 meses',
                'No balbucea ni hace sonidos',
                'No responde a su nombre',
                'No muestra interés en objetos'
            ]
        }
    },
    {
        id: 'infant-mid-stimulation',
        stageId: 'infant-mid',
        order: 8,
        title: 'Estimulación',
        description: 'Juegos de causa-efecto',
        icon: 'toys',
        isPriority: false,
        content: {
            intro: 'Juguetes que responden a acciones. Escondidas. Apilar y tirar. Tu bebé está aprendiendo cómo funciona el mundo.',
            sections: [
                { title: 'Juguetes Recomendados', content: 'Juguetes musicales con botones. Bloques blandos para apilar. Cubos con formas. Libros de cartón grueso. Pelotas de diferentes texturas.' },
                { title: 'Actividades', content: 'Juego de las escondidas (peek-a-boo). Esconder juguetes bajo una manta. Imitar sonidos y gestos. Lectura interactiva señalando imágenes.' },
                { title: 'Exploración Segura', content: 'Deja que explore diferentes texturas. Juega con agua en el baño. Ofrece recipientes para meter/sacar objetos.' }
            ],
            tips: [
                'No necesitas juguetes caros - ollas y cucharas funcionan genial',
                'Sigue su interés - si algo le fascina, explóralo más',
                'El juego repetitivo es normal - así aprenden'
            ]
        }
    },
    {
        id: 'infant-mid-warning',
        stageId: 'infant-mid',
        order: 9,
        title: 'Señales de Alerta',
        description: 'Qué observar',
        icon: 'warning',
        isPriority: true,
        content: {
            intro: 'Señales que podrían indicar necesidad de evaluación profesional. Recuerda: cada bebé se desarrolla a su ritmo.',
            sections: [
                { title: 'Desarrollo Motor', content: 'No se sienta con apoyo a los 9 meses. No soporta peso en las piernas. Rigidez o flacidez extrema. No transfiere objetos entre manos.' },
                { title: 'Comunicación', content: 'Sin balbuceo con consonantes. No responde a su nombre. No mira donde señalas. No muestra expresiones faciales.' },
                { title: 'Conducta', content: 'No muestra afecto hacia cuidadores. No muestra interés en juguetes. Irritabilidad constante sin causa aparente.' }
            ],
            warningSignals: [
                'No se sienta con apoyo',
                'No transfiere objetos entre manos',
                'Sin balbuceo con consonantes',
                'No responde a su nombre',
                'Pérdida de habilidades adquiridas'
            ]
        }
    },
    {
        id: 'infant-mid-tips',
        stageId: 'infant-mid',
        order: 10,
        title: 'Tips Prácticos',
        description: 'Supervivencia diaria',
        icon: 'lightbulb',
        isPriority: false,
        content: {
            intro: 'Consejos para sobrellevar esta etapa activa y emocionante.',
            sections: [
                { title: 'Baby-Proofing', content: 'Cubre enchufes. Ancla muebles a la pared. Pon rejas en escaleras. Retira objetos pequeños del suelo. Guarda químicos y medicamentos bajo llave.' },
                { title: 'Ansiedad de Separación', content: 'Es normal entre 6-12 meses. Practica despedidas cortas y dulces. Nunca te escapes sin despedirte. El objeto de transición puede ayudar.' },
                { title: 'Rutinas', content: 'Las rutinas predecibles dan seguridad. Mantén horarios consistentes de comida y sueño. Flexibilidad dentro de la estructura.' }
            ],
            tips: [
                'Un bebé que explora es un bebé que aprende',
                'La paciencia con los terrores del extraño - es temporal',
                'Documenta estos momentos - pasa muy rápido',
                'Pide ayuda si te sientes abrumado/a'
            ]
        }
    }
];

export const INFANT_LATE_MODULES: GuideModule[] = [
    {
        id: 'infant-late-intro',
        stageId: 'infant-late',
        order: 1,
        title: 'Casi Caminando',
        description: '9-12 meses hacia la independencia',
        icon: 'directions_walk',
        isPriority: true,
        content: {
            intro: 'Tu bebé está en la cúspide de caminar. Entiende mucho más de lo que puede expresar. Es un pequeño explorador con voluntad propia.',
            sections: [
                { title: 'Grandes Hitos', content: 'De pie con apoyo. Crucero (caminar agarrado de muebles). Primeras palabras con significado (mamá, papá). Señalar lo que quiere. Imitar acciones.' },
                { title: 'Comunicación', content: 'Entiende muchas palabras aunque diga pocas. Sigue instrucciones simples. Usa gestos para comunicarse. Puede decir 1-3 palabras.' },
                { title: 'Independencia', content: 'Quiere hacer cosas solo. Come con los dedos hábilmente. Puede mostrar frustración cuando no puede hacer algo.' }
            ],
            tips: [
                'Celebra cada logro, por pequeño que sea',
                '¡El primer cumpleaños se acerca!',
                'Su personalidad brilla más cada día',
                'La paciencia es tu mejor herramienta'
            ]
        }
    },
    {
        id: 'infant-late-feeding',
        stageId: 'infant-late',
        order: 2,
        title: 'Alimentación',
        description: 'Mesa familiar',
        icon: 'restaurant',
        isPriority: true,
        content: {
            intro: 'Puede comer casi todo lo de la familia (sin sal/azúcar excesivo). La alimentación se convierte en una actividad social.',
            sections: [
                { title: 'Transición al Año', content: 'Hacia el año: leche entera reemplaza fórmula/lactancia. 3 comidas + 2 snacks. Agua en vaso con boquilla o popote.' },
                { title: 'Texturas y Variedad', content: 'Comida cortada en trocitos. Prueba diferentes texturas. No te rindas con alimentos rechazados - pueden necesitar 10-15 exposiciones.' },
                { title: 'Independencia', content: 'Déjalo practicar con la cuchara aunque el desorden sea inevitable. El vaso con asas es buen paso previo al vaso normal.' }
            ],
            checklist: [
                { id: 'ilf-1', text: '¿Tienes vasos con boquilla/popote?', category: 'Equipamiento' },
                { id: 'ilf-2', text: '¿Has introducido los alérgenos principales?', category: 'Alimentación' },
                { id: 'ilf-3', text: '¿Come variedad de frutas y verduras?', category: 'Nutrición' }
            ],
            tips: [
                'Ofrece variedad - los gustos se forman ahora',
                'El hierro sigue siendo crucial',
                'Reduce la leche nocturna gradualmente',
                'Modela buenos hábitos alimenticios'
            ]
        }
    },
    {
        id: 'infant-late-sleep',
        stageId: 'infant-late',
        order: 3,
        title: 'Sueño',
        description: 'Patrones establecidos',
        icon: 'bedtime',
        isPriority: false,
        content: {
            intro: '13-14 horas totales. 1-2 siestas. Puede haber regresiones por hitos motores como aprender a caminar.',
            sections: [
                { title: 'Patrones Típicos', content: '11-12 horas de noche. 2-3 horas de siestas. Muchos consolidan a 1 siesta larga hacia el año.' },
                { title: 'Regresión de los 12 Meses', content: 'Aprender a caminar puede interrumpir el sueño. Practican de pie en la cuna. Mantén la rutina - pasará.' },
                { title: 'Transición de Siestas', content: 'Algunos pasan de 2 siestas a 1 entre 12-18 meses. Puede ser un proceso gradual.' }
            ],
            tips: [
                'No abandones la segunda siesta muy pronto',
                'La hora de dormir puede adelantarse temporalmente',
                'Objeto de transición ayuda con la autonomía',
                'Rutina consistente = mejor sueño'
            ]
        }
    },
    {
        id: 'infant-late-hygiene',
        stageId: 'infant-late',
        order: 4,
        title: 'Higiene',
        description: 'Más dientes, más cuidado',
        icon: 'bathtub',
        isPriority: false,
        content: {
            intro: 'Cepilla los dientes que aparezcan. El baño es momento de juego y aprendizaje.',
            sections: [
                { title: 'Cuidado Dental', content: 'Cepilla 2 veces al día. Usa pasta con flúor del tamaño de un grano de arroz. La primera cita dental al cumplir 1 año.' },
                { title: 'Baño Divertido', content: 'Se para en la bañera (con cuidado). Juguetes que estimulan. Es más independiente pero NUNCA solo.' },
                { title: 'Cambio de Pañal', content: 'Puede intentar escapar. Distracción es clave. Algunas familias empiezan a familiarizar con la bacinica.' }
            ],
            tips: [
                'Haz del cepillado un juego',
                'Deja que "cepille" primero y luego tú terminas',
                'Antideslizantes en la bañera son esenciales'
            ]
        }
    },
    {
        id: 'infant-late-motor',
        stageId: 'infant-late',
        order: 5,
        title: 'Desarrollo Motor',
        description: 'Primeros pasos',
        icon: 'directions_walk',
        isPriority: false,
        content: {
            intro: 'Algunos caminan a los 9 meses, otros a los 15. Ambos son normales. La mayoría camina entre 12-14 meses.',
            sections: [
                { title: 'Cruising', content: 'Camina agarrado de muebles. Es práctica para equilibrio y coordinación. Asegura que los muebles estén anclados.' },
                { title: 'Primeros Pasos', content: 'Los primeros pasos son tambaleantes. Brazos arriba para equilibrio. Caídas frecuentes son normales.' },
                { title: 'Motricidad Fina', content: 'Pinza perfeccionada. Puede meter objetos en contenedores. Señala con el índice. Aplaude, hace adiós.' }
            ],
            tips: [
                'Pies descalzos en casa ayudan al desarrollo',
                'No uses andadores - no ayudan y pueden ser peligrosos',
                'Celebra los intentos, no solo los logros',
                'Zapatos solo cuando camina afuera'
            ]
        }
    },
    {
        id: 'infant-late-cognitive',
        stageId: 'infant-late',
        order: 6,
        title: 'Desarrollo Cognitivo',
        description: 'Comprensión expandida',
        icon: 'psychology',
        isPriority: false,
        content: {
            intro: 'Entiende "no". Sigue instrucciones simples. Señala lo que quiere. La comunicación se expande rápidamente.',
            sections: [
                { title: 'Comprensión', content: 'Entiende más de lo que dice. Reconoce nombres de objetos y personas. Sigue instrucciones de un paso.' },
                { title: 'Resolución de Problemas', content: 'Experimenta para lograr objetivos. Usa objetos como herramientas. Busca objetos escondidos.' },
                { title: 'Imitación', content: 'Imita acciones de adultos. Juego de simulación emerge. Le encanta imitar tareas del hogar.' }
            ],
            tips: [
                'Nombra todo lo que ves durante el día',
                'Lee libros interactivos con solapas',
                'Responde cuando señala - expande su comunicación',
                'El juego de imitación es aprendizaje poderoso'
            ]
        }
    },
    {
        id: 'infant-late-health',
        stageId: 'infant-late',
        order: 7,
        title: 'Salud y Vacunas',
        description: 'Control del año',
        icon: 'vaccines',
        isPriority: true,
        content: {
            intro: 'El chequeo del primer año es muy importante. Vacunas de 12 meses y evaluación completa del desarrollo.',
            sections: [
                { title: 'Vacunas de 12 Meses', content: 'Triple Viral (Sarampión, Rubéola, Paperas). Varicela. Hepatitis A (1ª dosis). Neumococo (refuerzo). Haemophilus (refuerzo).' },
                { title: 'Chequeo del Año', content: 'Medición de peso, talla, perímetro cefálico. Evaluación del desarrollo. Discusión sobre alimentación, sueño, seguridad.' },
                { title: 'Transición de Leche', content: 'Después del año: leche entera de vaca (no descremada). 16-24 oz por día máximo. La leche no debe reemplazar comida sólida.' }
            ],
            warningSignals: [
                'No soporta peso en piernas a los 12 meses',
                'No dice ninguna palabra ni balbucea',
                'No señala ni usa gestos',
                'No responde a su nombre',
                'Pérdida de habilidades adquiridas'
            ]
        }
    },
    {
        id: 'infant-late-stimulation',
        stageId: 'infant-late',
        order: 8,
        title: 'Estimulación',
        description: 'Juego activo',
        icon: 'toys',
        isPriority: false,
        content: {
            intro: 'Juguetes de empujar/jalar. Bloques. Lectura interactiva. El juego se vuelve más complejo y físico.',
            sections: [
                { title: 'Juguetes Ideales', content: 'Juguetes de empujar y jalar. Bloques para apilar. Juguetes de encajar formas. Libros con texturas y solapas. Teléfonos de juguete.' },
                { title: 'Actividades', content: 'Esconder y buscar objetos. Imitar tareas del hogar. Jugar con agua y arena. Música y baile. Garabatear con crayones gruesos.' },
                { title: 'Lectura', content: 'Libros con imágenes simples. Señala y nombra. Deja que pase las páginas. Haz preguntas: ¿Dónde está el perro?' }
            ],
            tips: [
                'Juguetes simples estimulan más la imaginación',
                'El juego al aire libre es valioso',
                'Sigue su interés - aprende más cuando está motivado',
                'Tú eres su juguete favorito'
            ]
        }
    },
    {
        id: 'infant-late-warning',
        stageId: 'infant-late',
        order: 9,
        title: 'Señales de Alerta',
        description: 'Desarrollo atípico',
        icon: 'warning',
        isPriority: true,
        content: {
            intro: 'Señales que podrían indicar necesidad de evaluación. Confía en tu instinto - si algo te preocupa, consulta.',
            sections: [
                { title: 'Motor', content: 'No soporta peso en piernas. No se para con ayuda. No agarra objetos con pinza. Movimientos asimétricos.' },
                { title: 'Comunicación', content: 'Sin balbuceo. No señala ni usa gestos. No responde a su nombre. No mira donde señalas.' },
                { title: 'Social', content: 'No muestra afecto. No busca interacción. No imita acciones simples. No muestra preferencia por cuidadores.' }
            ],
            warningSignals: [
                'No soporta peso en piernas',
                'No señala ni usa gestos',
                'No responde a su nombre',
                'No imita acciones o sonidos',
                'Pérdida de habilidades adquiridas'
            ]
        }
    },
    {
        id: 'infant-late-tips',
        stageId: 'infant-late',
        order: 10,
        title: 'Tips Prácticos',
        description: 'El primer cumpleaños',
        icon: 'lightbulb',
        isPriority: false,
        content: {
            intro: 'El primer año fue intenso. ¡Lo lograron! Celebra este hito y prepárate para la siguiente aventura.',
            sections: [
                { title: 'Celebración', content: 'El primer cumpleaños es más para los padres. No necesita fiesta elaborada. Fotos y momentos simples son suficientes.' },
                { title: 'Transiciones', content: 'De biberón a vaso. De fórmula a leche entera. De cuna a... ¿todavía no? La cuna puede durar hasta 2-3 años.' },
                { title: 'Seguridad', content: 'Con la movilidad viene más riesgo. Revisa el childproofing. Gabinetes, cajones, muebles anclados, protectores de esquinas.' }
            ],
            tips: [
                'Toma muchas fotos del primer pastel',
                'No hay prisa para dejar el biberón',
                'Un bebé móvil necesita supervisión constante',
                '¡Sobreviviste el primer año - felicidades!',
                'El segundo año trae nuevos desafíos y alegrías'
            ]
        }
    }
];

export const TODDLER_EARLY_MODULES: GuideModule[] = [
    {
        id: 'toddler-early-intro',
        stageId: 'toddler-early',
        order: 1,
        title: 'Pequeños Exploradores',
        description: '1-2 años: Independencia',
        icon: 'directions_run',
        isPriority: true,
        content: {
            intro: 'Camina, corre, trepa. Dice sus primeras palabras. Los berrinches comienzan. Bienvenido a la etapa del "yo solo".',
            sections: [
                { title: 'Hitos Clave', content: 'Camina bien hacia los 15 meses. Corre hacia los 18-24 meses. Vocabulario explosivo: de 10 a 200+ palabras. Primeras frases de 2 palabras.' },
                { title: 'Independencia', content: 'Quiere hacer todo solo. "No" es su palabra favorita. Prueba límites constantemente. Esto es desarrollo saludable.' },
                { title: 'Emociones Intensas', content: 'No puede regular emociones aún. Berrinches son normales. Frustración cuando no puede comunicar o lograr algo.' }
            ],
            tips: ['La paciencia es tu superpoder', 'Los berrinches disminuyen con el lenguaje', 'Dale opciones (no más de 2)', 'Celebra la independencia en tareas seguras']
        }
    },
    {
        id: 'toddler-early-feeding',
        stageId: 'toddler-early',
        order: 2,
        title: 'Alimentación',
        description: 'Comer como la familia',
        icon: 'restaurant',
        isPriority: false,
        content: {
            intro: 'Come con la familia. Puede usar cuchara. Leche entera hasta los 2 años. La selectividad alimentaria es normal y temporal.',
            sections: [
                { title: 'Comidas Estructuradas', content: '3 comidas + 2 snacks. No pastorear todo el día. Ofrece variedad aunque rechace. Puede tardar 15+ exposiciones para aceptar un alimento.' },
                { title: 'Independencia', content: 'Practica con cuchara y tenedor. El desorden es parte del aprendizaje. Vaso sin tapa hacia los 18 meses.' },
                { title: 'Selectividad Normal', content: 'Es una fase de desarrollo. No fuerces. Modela buena alimentación. Evita batallas de comida.' }
            ],
            tips: ['No uses la comida como premio o castigo', 'Ofrece lo mismo que come la familia', 'Porciones pequeñas - puede pedir más', 'Leche: máximo 16-20 oz/día']
        }
    },
    {
        id: 'toddler-early-sleep',
        stageId: 'toddler-early',
        order: 3,
        title: 'Sueño',
        description: '11-14 horas',
        icon: 'bedtime',
        isPriority: false,
        content: {
            intro: '11-14 horas totales. 1-2 siestas que se consolidan a 1. La transición a cama puede comenzar hacia los 2 años.',
            sections: [
                { title: 'Patrones Típicos', content: '11-12 horas de noche. 1-2 horas de siesta. Muchos pasan a 1 siesta entre 15-18 meses.' },
                { title: 'Resistencia a Dormir', content: 'El FOMO (miedo a perderse algo) es real. Rutinas predecibles ayudan. Límites claros y amorosos.' },
                { title: 'Transición a Cama', content: 'No hay prisa - la cuna puede durar hasta 3 años. Solo cambia si trepa peligrosamente o pide.' }
            ],
            tips: ['Rutina consistente: baño, pijama, cuento, canción', 'Alargar la rutina no ayuda - breve y dulce', 'Un objeto transicional da seguridad', 'Evita pantallas 1 hora antes de dormir']
        }
    },
    {
        id: 'toddler-early-hygiene',
        stageId: 'toddler-early',
        order: 4,
        title: 'Higiene',
        description: 'Introducción al baño solo',
        icon: 'bathtub',
        isPriority: false,
        content: {
            intro: 'Puede mostrar interés en el baño. No hay prisa para quitar el pañal - cada niño tiene su ritmo.',
            sections: [
                { title: 'Señales de Preparación', content: 'Incomodidad con pañal sucio. Avisa cuando hace. Se mantiene seco 2+ horas. Interés en el baño.' },
                { title: 'No Presiones', content: 'Presionar antes de tiempo atrasa el proceso. La mayoría está lista entre 2-3 años. Niñas suelen adelantarse.' },
                { title: 'Higiene General', content: 'Cepillado dental 2x día. Lavado de manos después del baño y antes de comer. Baño puede ser día por medio.' }
            ],
            tips: ['Deja que observe cuando tú usas el baño', 'Celebra los éxitos sin exagerar', 'Los accidentes son parte del proceso', 'Nunca avergüences']
        }
    },
    {
        id: 'toddler-early-motor',
        stageId: 'toddler-early',
        order: 5,
        title: 'Desarrollo Motor',
        description: 'Corre y trepa',
        icon: 'directions_run',
        isPriority: false,
        content: {
            intro: 'Camina bien. Comienza a correr. Sube escaleras con ayuda. Garabatea. Un torbellino de energía.',
            sections: [
                { title: 'Motricidad Gruesa', content: 'Corre (15-18 meses). Sube escaleras tomado de la mano. Patea pelota. Trepa en todo. Salta desde escalón bajo.' },
                { title: 'Motricidad Fina', content: 'Garabatea con crayones. Construye torres de 4-6 bloques. Pasa páginas de libro. Usa cuchara (desordenadamente).' },
                { title: 'Seguridad', content: 'Este niño NECESITA supervisión constante. Trepa todo sin medir peligro. Ancla muebles. Rejas en escaleras.' }
            ],
            tips: ['Mucho tiempo de juego activo ayuda con el sueño', 'Zapatos con suela flexible para caminar', 'Deja que explore - dentro de límites seguros', 'Parques son ideales para gastar energía']
        }
    },
    {
        id: 'toddler-early-cognitive',
        stageId: 'toddler-early',
        order: 6,
        title: 'Desarrollo Cognitivo',
        description: 'Explosión del lenguaje',
        icon: 'psychology',
        isPriority: false,
        content: {
            intro: 'De 50 palabras a 200+. Combina 2 palabras. El juego simbólico comienza. Su mente es una esponja.',
            sections: [
                { title: 'Lenguaje', content: '18 meses: 10-50 palabras. 24 meses: 200-300 palabras. Frases de 2 palabras: "más leche", "mamá ven". Entiende mucho más de lo que dice.' },
                { title: 'Juego Simbólico', content: 'Simula alimentar muñecos. Imita tareas del hogar. Usa objetos de forma imaginativa (caja = carro).' },
                { title: 'Comprensión', content: 'Sigue instrucciones de 2 pasos. Identifica partes del cuerpo. Reconoce objetos en libros. Categoriza (animales, comida).' }
            ],
            tips: ['Habla constantemente narrando el día', 'Lee libros todos los días', 'Expande lo que dice: "¿Pelota? Sí, pelota roja grande"', 'Evita corregir - solo modela correctamente']
        }
    },
    {
        id: 'toddler-early-health',
        stageId: 'toddler-early',
        order: 7,
        title: 'Salud',
        description: 'Chequeos anuales',
        icon: 'vaccines',
        isPriority: true,
        content: {
            intro: 'Vacunas de refuerzo a los 15-18 meses. Chequeo dental recomendado. Evaluación continua del desarrollo.',
            sections: [
                { title: 'Vacunas', content: '15-18 meses: Refuerzos de DTaP, Neumococo, MMR, Varicela, Hepatitis A (2ª dosis). Gripe anualmente.' },
                { title: 'Chequeo Dental', content: 'Primera visita si no se ha hecho. Después cada 6 meses. Cepillado 2x/día con pasta fluorada (cantidad grano de arroz).' },
                { title: 'Desarrollo', content: 'El pediatra evaluará lenguaje, motor, social. Es momento de detectar retrasos tempranamente.' }
            ],
            warningSignals: ['Menos de 50 palabras a los 24 meses', 'No combina 2 palabras a los 2 años', 'Camina solo en puntillas', 'Pérdida de habilidades', 'No responde al nombre']
        }
    },
    {
        id: 'toddler-early-stimulation',
        stageId: 'toddler-early',
        order: 8,
        title: 'Estimulación',
        description: 'Juego imaginativo',
        icon: 'toys',
        isPriority: false,
        content: {
            intro: 'Juego de roles. Bloques. Arte. Música. Libros con historias simples. El juego es su trabajo.',
            sections: [
                { title: 'Juguetes Ideales', content: 'Bloques de construcción. Plastilina. Crayones gruesos. Muñecos. Set de cocina/herramientas. Instrumentos musicales simples.' },
                { title: 'Actividades', content: 'Lectura interactiva. Canciones con gestos. Juego de simulación (cocinita, doctores). Arte con dedos. Juego al aire libre.' },
                { title: 'Pantallas', content: 'AAP recomienda: 0 minutos antes de 18 meses (excepto videollamadas). 18-24 meses: alta calidad, con padres.' }
            ],
            tips: ['El juego libre es el mejor aprendizaje', 'Juega CON él, no solo cerca', 'Limita pantallas - impacta desarrollo del lenguaje', 'La música desarrolla el lenguaje']
        }
    },
    {
        id: 'toddler-early-warning',
        stageId: 'toddler-early',
        order: 9,
        title: 'Señales de Alerta',
        description: 'Desarrollo del lenguaje',
        icon: 'warning',
        isPriority: true,
        content: {
            intro: 'El período de 12-24 meses es crucial para detectar retrasos. La intervención temprana marca una diferencia enorme.',
            sections: [
                { title: 'Lenguaje', content: 'Menos de 50 palabras a los 2 años. No combina palabras. No señala para mostrar. No responde a su nombre.' },
                { title: 'Social', content: 'No busca interacción. No mira a los ojos. No imita. No muestra objetos. Prefiere jugar solo siempre.' },
                { title: 'Motor', content: 'No camina a los 18 meses. Camina solo en puntas. Movimientos asimétricos. No usa pinza.' }
            ],
            warningSignals: ['Menos de 50 palabras a los 2 años', 'No combina palabras', 'No responde al nombre', 'No mira a los ojos', 'Pérdida de habilidades adquiridas']
        }
    },
    {
        id: 'toddler-early-tips',
        stageId: 'toddler-early',
        order: 10,
        title: 'Tips: Berrinches',
        description: 'Manejo de emociones',
        icon: 'lightbulb',
        isPriority: true,
        content: {
            intro: 'Los berrinches son NORMALES. Su cerebro no puede regular emociones aún. Tu calma es su ancla.',
            sections: [
                { title: 'Por Qué Ocurren', content: 'Frustración por no poder comunicar o lograr algo. Hambre, cansancio, sobreestimulación. Necesidad de autonomía. Son parte del desarrollo.' },
                { title: 'Qué Hacer', content: 'Mantén la calma (tu ejemplo importa). Asegura que esté seguro. Valida la emoción: "Sé que estás enojado". No razones durante el berrinche - espera.' },
                { title: 'Qué NO Hacer', content: 'No grites - escalas la situación. No cedas a lo que pedía - refuerza berrinches. No castigues - no controla sus emociones aún.' }
            ],
            tips: ['Prevención: rutinas, snacks, siestas a tiempo', 'Durante: mantén calma, espera que pase', 'Después: abrazo, palabras simples, seguir adelante', 'Recuerda: esto pasará con el desarrollo del lenguaje', 'Cuídate: los berrinches son agotadores para ti también']
        }
    }
];

export const TODDLER_LATE_MODULES: GuideModule[] = [
    {
        id: 'toddler-late-intro', stageId: 'toddler-late', order: 1, title: 'Los Terribles Dos', description: '2-3 años: Voluntad propia', icon: 'sports_handball', isPriority: true,
        content: {
            intro: 'Máxima independencia. "Yo solo". Berrinches en su punto más alto. Oraciones completas. Bienvenido a los "terribles dos" - que en realidad pueden durar hasta los 4.',
            sections: [
                { title: 'Características', content: 'Voluntad propia muy marcada. "No" a todo. Quiere independencia pero aún necesita ayuda. Emociones intensas.' },
                { title: 'Lenguaje', content: 'Oraciones de 3-4+ palabras. Miles de preguntas. Puede mantener conversaciones. Cuenta historias.' },
                { title: 'Habilidades', content: 'Come solo. Se viste parcialmente. Control de esfínteres en proceso. Juego imaginativo complejo.' }
            ],
            tips: ['Esta etapa pasará - mantén la calma', 'La consistencia es tu mejor herramienta', 'Dale poder donde puedas (opciones limitadas)', 'Celebra su creciente independencia']
        }
    },
    {
        id: 'toddler-late-feeding', stageId: 'toddler-late', order: 2, title: 'Alimentación', description: 'Come solo con cubiertos', icon: 'restaurant', isPriority: false,
        content: {
            intro: 'Usa tenedor y cuchara. Puede servirse agua. La selectividad puede persistir pero generalmente mejora.',
            sections: [
                { title: 'Habilidades', content: 'Come con cubiertos de manera competente. Bebe de vaso abierto. Puede servirse de una jarra pequeña. Ayuda a preparar comidas simples.' },
                { title: 'Nutrición', content: 'Transición a leche baja en grasa después de los 2. Porciones de niño (1/4 de adulto). 5 porciones de frutas/verduras al día ideal.' },
                { title: 'Selectividad', content: 'La mayoría supera esta fase. Sigue ofreciendo variedad sin presionar. Los niños regulan bien sus calorías.' }
            ],
            tips: ['Involúcralo en la preparación - comerá más', 'Las comidas familiares son importantes', 'Corta en formas divertidas', 'Límite de leche: 16 oz/día máximo']
        }
    },
    {
        id: 'toddler-late-sleep', stageId: 'toddler-late', order: 3, title: 'Sueño', description: 'Transición a cama', icon: 'bedtime', isPriority: false,
        content: {
            intro: '11-12 horas. 1 siesta (puede dejarla hacia los 3). El FOMO es real. Miedos nocturnos pueden aparecer.',
            sections: [
                { title: 'Transición a Cama', content: 'Entre 2-3 años generalmente. Señales: trepa peligrosamente o pide. Haz la transición gradual. Barandas de seguridad recomendadas.' },
                { title: 'Resistencia a Dormir', content: 'Quiere "un vaso más" o "un cuento más". Límites claros y amorosos. No alargar la rutina indefinidamente.' },
                { title: 'Miedos Nocturnos', content: 'Monstruos, oscuridad normales a esta edad. Lámpara de noche. "Spray anti-monstruos". Valida sin dramatizar.' }
            ],
            tips: ['Mantén la siesta hasta que claramente la rechace', 'Rutina predecible reduce resistencia', 'Reloj de "OK para despertar" ayuda', 'Paciencia con los miedos - son reales para él']
        }
    },
    {
        id: 'toddler-late-hygiene', stageId: 'toddler-late', order: 4, title: 'Control de Esfínteres', description: 'Entrenamiento para ir al baño', icon: 'bathtub', isPriority: true,
        content: {
            intro: 'La mayoría está lista entre 2-3 años. Las señales de preparación son clave. Paciencia - no es carrera.',
            sections: [
                { title: 'Señales de Preparación', content: 'Incomodidad con pañal sucio. Se mantiene seco 2+ horas. Avisa cuando hace. Puede subir/bajar pantalones. Muestra interés.' },
                { title: 'Proceso', content: 'Familiariza primero (deja que observe). Introduce la bacinica. Ofrece sin forzar. Celebra éxitos sin exagerar. Accidentes son normales.' },
                { title: 'Lo Que No Funciona', content: 'Premios excesivos. Castigos/regaños. Comenzar muy temprano. Presión de familiares. Comparar con otros niños.' }
            ],
            checklist: [
                { id: 'te-1', text: '¿Muestra incomodidad con el pañal sucio?', category: 'Preparación' },
                { id: 'te-2', text: '¿Puede estar seco 2+ horas?', category: 'Preparación' },
                { id: 'te-3', text: '¿Muestra interés en el baño?', category: 'Preparación' },
                { id: 'te-4', text: '¿Puede subirse/bajarse los pantalones?', category: 'Preparación' }
            ],
            tips: ['No apures - un niño que no está listo tardará más', 'Día antes que noche', 'Ropa fácil de quitar', 'Accidentes ≠ retroceso']
        }
    },
    {
        id: 'toddler-late-motor', stageId: 'toddler-late', order: 5, title: 'Desarrollo Motor', description: 'Coordinación avanzada', icon: 'sports_handball', isPriority: false,
        content: {
            intro: 'Corre bien. Salta. Sube escaleras alternando pies. Pedalea triciclo. Energía infinita.',
            sections: [
                { title: 'Motricidad Gruesa', content: 'Corre, salta, trepa con destreza. Sube escaleras alternando pies. Pedalea triciclo. Lanza y patea pelota.' },
                { title: 'Motricidad Fina', content: 'Dibuja círculos, líneas, personas primitivas. Usa tijeras (supervisado). Torres de 8-10 bloques. Se viste parcialmente.' },
                { title: 'Juego Activo', content: '3+ horas de actividad física diaria recomendadas. Juego al aire libre crucial. Reduce tiempo sedentario.' }
            ],
            tips: ['El parque es tu mejor amigo', 'Juegos de pelota desarrollan coordinación', 'El arte desarrolla motricidad fina', 'Deja que se ensucie explorando']
        }
    },
    {
        id: 'toddler-late-cognitive', stageId: 'toddler-late', order: 6, title: 'Desarrollo Cognitivo', description: 'Oraciones y preguntas', icon: 'psychology', isPriority: false,
        content: {
            intro: 'Oraciones de 4+ palabras. Preguntas constantes (¿Por qué?). Juego simbólico elaborado. Imaginación floreciente.',
            sections: [
                { title: 'Lenguaje', content: 'Oraciones completas. Cuenta historias. Hace preguntas constantemente. Vocabulario de 1000+ palabras. 75% entendible por extraños.' },
                { title: 'Pensamiento', content: 'Entiende conceptos: grande/pequeño, arriba/abajo. Categoriza. Sigue instrucciones de 3 pasos. Resuelve problemas simples.' },
                { title: 'Imaginación', content: 'Juego simbólico elaborado. Amigos imaginarios posibles. Confunde realidad y fantasía a veces. Creatividad floreciente.' }
            ],
            tips: ['Responde las preguntas aunque sean repetitivas', 'Lee libros más complejos', 'Fomenta el juego imaginativo', 'Los amigos imaginarios son normales']
        }
    },
    {
        id: 'toddler-late-health', stageId: 'toddler-late', order: 7, title: 'Salud', description: 'Chequeo y dental', icon: 'vaccines', isPriority: false,
        content: {
            intro: 'Chequeo anual. Visitas dentales cada 6 meses. Posible refuerzo de vacunas.',
            sections: [
                { title: 'Chequeos', content: 'Evaluación anual de desarrollo. Visión y audición si hay preocupaciones. Crecimiento y peso.' },
                { title: 'Dental', content: 'Visitas cada 6 meses. Cepillado 2x/día con pasta fluorada (cantidad arveja). Evita acostarlo con biberón/leche.' },
                { title: 'Inmunizaciones', content: 'Gripe anualmente. Posibles refuerzos pendientes. Revisar cartilla.' }
            ],
            warningSignals: ['Lenguaje incomprensible para extraños', 'No forma oraciones', 'Pérdida de habilidades', 'Problemas de equilibrio persistentes']
        }
    },
    {
        id: 'toddler-late-stimulation', stageId: 'toddler-late', order: 8, title: 'Estimulación', description: 'Juego cooperativo', icon: 'toys', isPriority: false,
        content: {
            intro: 'Comienza a jugar CON otros niños (no solo al lado). Artes, plastilina, disfraz. El juego es aprendizaje.',
            sections: [
                { title: 'Juego Social', content: 'Transición de juego paralelo a cooperativo. Turnos (con práctica). Amistades emergen. Conflictos son normales - aprende a resolverlos.' },
                { title: 'Actividades Ideales', content: 'Plastilina, pintura, dibujo. Disfraces y juego de roles. Bloques y construcción. Rompecabezas simples. Música y baile.' },
                { title: 'Pantallas', content: 'Límite de 1 hora/día de alta calidad. Ver juntos cuando sea posible. Priorizar juego activo sobre pantallas.' }
            ],
            tips: ['El juego imaginativo desarrolla empatía', 'Los conflictos son oportunidades de aprendizaje', 'Resiste la tentación de resolver todo por él', 'El aburrimiento fomenta creatividad']
        }
    },
    {
        id: 'toddler-late-warning', stageId: 'toddler-late', order: 9, title: 'Señales de Alerta', description: 'Desarrollo social', icon: 'warning', isPriority: true,
        content: {
            intro: 'La detección temprana sigue siendo crucial. Si algo te preocupa, consulta sin esperar.',
            sections: [
                { title: 'Comunicación', content: 'Lenguaje incomprensible para extraños. No forma oraciones de 2+ palabras. Habla poco o nada. Ecolalia excesiva.' },
                { title: 'Social', content: 'No hay juego simbólico. No mira a los ojos. No muestra interés en otros niños. Prefiere jugar solo siempre.' },
                { title: 'Conducta', content: 'Berrinches extremadamente intensos o frecuentes. Conductas repetitivas. Pérdida de habilidades. Rigidez extrema a cambios.' }
            ],
            warningSignals: ['No hay juego simbólico', 'No forma oraciones', 'No mira a los ojos', 'Pérdida de habilidades', 'Conductas repetitivas intensas']
        }
    },
    {
        id: 'toddler-late-tips', stageId: 'toddler-late', order: 10, title: 'Tips: Disciplina Positiva', description: 'Límites con amor', icon: 'lightbulb', isPriority: true,
        content: {
            intro: 'La disciplina es enseñanza, no castigo. Límites claros y consistentes. Tu conexión es tu herramienta más poderosa.',
            sections: [
                { title: 'Principios Básicos', content: 'Límites claros y consistentes. Consecuencias naturales cuando sea posible. Opciones limitadas (2 máximo). Conectar antes de corregir.' },
                { title: 'Tiempo Fuera Efectivo', content: 'No antes de los 3 años. 1 minuto por año de edad. Lugar seguro y aburrido. Reconectar después.' },
                { title: 'Lo Que NO Funciona', content: 'Gritos (escalan la situación). Nalgadas (enseñan agresión). Amenazas vacías. Inconsistencia.' }
            ],
            tips: ['Modelo lo que quieres ver', 'Elige tus batallas', 'Prevención: rutinas y necesidades básicas cubiertas', 'Cuida tu regulación emocional primero', 'Busca el "sí" dentro del "no"']
        }
    }
];

export const PRESCHOOL_MODULES: GuideModule[] = [
    {
        id: 'preschool-intro', stageId: 'preschool', order: 1, title: 'Grandes Preguntas', description: '3-5 años: Curiosidad infinita', icon: 'school', isPriority: true,
        content: {
            intro: 'La edad del "¿Por qué?". Imaginación desbordante. Amigos imaginarios. Preparación escolar. Una mente en expansión constante.',
            sections: [
                { title: 'Características', content: 'Preguntas constantes. Imaginación vivida. Mejores habilidades sociales. Puede seguir reglas. Juega cooperativamente.' },
                { title: 'Lenguaje', content: 'Oraciones complejas. Cuenta historias elaboradas. Habla claramente. Vocabulario de 2000+ palabras. Disfruta rimas y canciones.' },
                { title: 'Independencia', content: 'Se viste solo. Va al baño solo. Come sin ayuda. Tiene opiniones fuertes. Busca aprobación de adultos.' }
            ],
            tips: ['Responde las preguntas pacientemente', 'Fomenta la imaginación - es aprendizaje', 'Establecer rutinas para la escuela', 'Los amigos cobran importancia']
        }
    },
    {
        id: 'preschool-feeding', stageId: 'preschool', order: 2, title: 'Alimentación', description: 'Independiente en la mesa', icon: 'restaurant', isPriority: false,
        content: {
            intro: 'Come solo con buenos modales. Puede ayudar a preparar comidas simples. Modelo de alimentación saludable.',
            sections: [
                { title: 'Habilidades', content: 'Usa cuchillo de mantequilla. Sirve líquidos. Unta y esparce. Ayuda a mezclar, cortar con supervisión, poner la mesa.' },
                { title: 'Nutrición', content: 'Leche baja en grasa. 5 porciones de frutas/verduras. Proteína magra. Limitar azúcares y procesados. Agua como bebida principal.' },
                { title: 'Comportamiento', content: 'Modales en la mesa. Conversación durante las comidas. Sin pantallas mientras come. Probar cosas nuevas sin presionar.' }
            ],
            tips: ['Cocinen juntos - aumenta aceptación de alimentos', 'Modela lo que quieres que coma', 'Las comidas familiares son importantes', 'No uses postre como premio']
        }
    },
    {
        id: 'preschool-sleep', stageId: 'preschool', order: 3, title: 'Sueño', description: '10-12 horas', icon: 'bedtime', isPriority: false,
        content: {
            intro: '10-12 horas de sueño. Muchos dejan la siesta entre 3-5 años. Miedos nocturnos comunes. Rutina consistente es fundamental.',
            sections: [
                { title: 'Sin Siesta', content: 'Hacia los 4-5 años la siesta desaparace. Hora de dormir más temprana puede ser necesaria. Tiempo tranquilo puede reemplazar siesta.' },
                { title: 'Miedos y Pesadillas', content: 'Muy comunes a esta edad. La imaginación vívida causa miedos. Valida sin dramatizar. Luz nocturna, objeto de seguridad ayudan.' },
                { title: 'Preparación Escolar', content: 'Establece rutina de madrugada. Practica despertar a tiempo. Prepara ropa la noche anterior.' }
            ],
            tips: ['Hora de dormir consistente, incluso fines de semana', 'Evita pantallas 1 hora antes de dormir', 'Los miedos son normales a esta edad', 'Rutina calmante: baño, libro, canción']
        }
    },
    {
        id: 'preschool-hygiene', stageId: 'preschool', order: 4, title: 'Higiene', description: 'Auto-cuidado', icon: 'bathtub', isPriority: false,
        content: {
            intro: 'Va al baño solo. Se lava las manos correctamente. Ayuda a vestirse completamente. Mayor autonomía en higiene.',
            sections: [
                { title: 'Baño Independiente', content: 'Va solo al baño. Puede necesitar ayuda para limpiarse. Lava manos después. Algunos accidentes aún normales.' },
                { title: 'Higiene Personal', content: 'Se cepilla dientes con supervisión. Se lava manos correctamente (20 segundos). Se peina. Suena la nariz.' },
                { title: 'Vestirse', content: 'Se viste solo mayormente. Maneja botones, cierres. Elige su ropa (con opciones). Distingue derecho/revés.' }
            ],
            tips: ['Supervisa el cepillado hasta los 7-8 años', 'Canción de lavado de manos (20 segundos)', 'Deja que elija ropa dentro de opciones apropiadas', 'Celebra la independencia']
        }
    },
    {
        id: 'preschool-motor', stageId: 'preschool', order: 5, title: 'Desarrollo Motor', description: 'Habilidades finas y gruesas', icon: 'accessibility_new', isPriority: false,
        content: {
            intro: 'Bicicleta con rueditas. Recorta con tijeras. Dibuja personas reconocibles. Coordinación refinándose.',
            sections: [
                { title: 'Motricidad Gruesa', content: 'Salta en un pie. Atrapa pelota. Bicicleta con rueditas. Equilibrio mejorado. Baila con ritmo.' },
                { title: 'Motricidad Fina', content: 'Dibuja personas, casas, soles. Escribe su nombre. Usa tijeras bien. Abotona. Corta con cuchillo de plastico.' },
                { title: 'Pre-escritura', content: 'Agarre de lápiz maduro. Traza líneas y formas. Copia letras. Colorea dentro de las líneas mayormente.' }
            ],
            tips: ['Juego al aire libre diario es esencial', 'Actividades de motricidad fina preparan para escribir', 'No fuerces la preferencia de mano', 'Bicicleta sin rueditas hacia los 5-6']
        }
    },
    {
        id: 'preschool-cognitive', stageId: 'preschool', order: 6, title: 'Desarrollo Cognitivo', description: 'Pre-lectura y números', icon: 'psychology', isPriority: false,
        content: {
            intro: 'Reconoce letras y algunos sonidos. Cuenta hasta 20+. Entiende conceptos de tiempo. Historias elaboradas y coherentes.',
            sections: [
                { title: 'Pre-lectura', content: 'Reconoce letras de su nombre. Algunos reconocen palabras. Entiende que los libros se leen de izquierda a derecha. Disfruta que le lean.' },
                { title: 'Números', content: 'Cuenta hasta 20-100. Reconoce números escritos. Entiende más/menos. Operaciones simples con dedos.' },
                { title: 'Conceptos', content: 'Ayer/hoy/mañana. Antes/después. Categoriza y clasifica. Patrones. Resolución de problemas simple.' }
            ],
            tips: ['Lee todos los días - el factor más importante', 'Cuenta todo: escalones, manzanas, carros', 'No presiones académicamente - el juego es aprendizaje', 'Responde todas las preguntas "¿Por qué?"']
        }
    },
    {
        id: 'preschool-health', stageId: 'preschool', order: 7, title: 'Salud', description: 'Vacunas preescolares', icon: 'vaccines', isPriority: true,
        content: {
            intro: 'Refuerzo de vacunas antes de entrar a la escuela. Chequeo visual y auditivo. Evaluación de desarrollo.',
            sections: [
                { title: 'Vacunas 4-6 años', content: 'Refuerzo DTaP. Refuerzo MMR. Refuerzo Polio. Refuerzo Varicela. Revisar cartilla con pediatra.' },
                { title: 'Chequeos', content: 'Visión y audición antes de la escuela. Desarrollo del lenguaje. Preparación escolar. Crecimiento general.' },
                { title: 'Dental', content: 'Visitas cada 6 meses. Posibles selladores dentales. Ortodoncista si hay problemas de mordida.' }
            ],
            warningSignals: ['Dificultad severa para separarse de padres', 'No juega con otros niños', 'Lenguaje difícil de entender', 'Problemas motores significativos', 'Dificultad para seguir instrucciones']
        }
    },
    {
        id: 'preschool-stimulation', stageId: 'preschool', order: 8, title: 'Estimulación', description: 'Preparación escolar', icon: 'toys', isPriority: true,
        content: {
            intro: 'Juegos de mesa simples. Actividades de pre-escritura. Socialización con pares. Preparación para el aprendizaje formal.',
            sections: [
                { title: 'Preparación Académica', content: 'Reconocer letras y números. Escribir su nombre. Contar. Seguir instrucciones de 3 pasos. Atención sostenida 10-15 min.' },
                { title: 'Habilidades Sociales', content: 'Compartir y turnos. Resolver conflictos con palabras. Hacer amigos. Seguir reglas grupales. Trabajar en equipo.' },
                { title: 'Independencia', content: 'Usar el baño solo. Lavarse manos. Vestirse. Guardar sus cosas. Pedir ayuda apropiadamente.' }
            ],
            checklist: [
                { id: 'ps-1', text: '¿Reconoce su nombre escrito?', category: 'Académico' },
                { id: 'ps-2', text: '¿Cuenta hasta 10?', category: 'Académico' },
                { id: 'ps-3', text: '¿Va al baño solo?', category: 'Independencia' },
                { id: 'ps-4', text: '¿Puede separarse de los padres?', category: 'Social' }
            ],
            tips: ['El juego sigue siendo la mejor forma de aprender', 'No sobre-agenda actividades', 'Las habilidades sociales son tan importantes como las académicas', 'Practica rutinas escolares en casa']
        }
    },
    {
        id: 'preschool-warning', stageId: 'preschool', order: 9, title: 'Señales de Alerta', description: 'Listos para la escuela', icon: 'warning', isPriority: false,
        content: {
            intro: 'A esta edad las diferencias en desarrollo son más visibles. Es buen momento para evaluación si hay preocupaciones.',
            sections: [
                { title: 'Lenguaje', content: 'Difícil de entender para extraños. No forma oraciones complejas. Tartamudeo persistente. No sigue instrucciones.' },
                { title: 'Social/Emocional', content: 'Ansiedad extrema de separación. No juega con pares. Berrinches intensos y frecuentes. Agresión persistente.' },
                { title: 'Motor/Cognitivo', content: 'Problemas significativos de coordinación. No sostiene lápiz. No reconoce ninguna letra/número. Atención muy limitada.' }
            ],
            warningSignals: ['Lenguaje incomprensible', 'Ansiedad de separación extrema', 'No juega con otros', 'Agresión persistente', 'Retraso motor significativo']
        }
    },
    {
        id: 'preschool-tips', stageId: 'preschool', order: 10, title: 'Tips: Transición a la Escuela', description: 'Preparación emocional', icon: 'lightbulb', isPriority: true,
        content: {
            intro: 'La transición a la escuela es un gran hito. Preparación emocional es tan importante como la académica.',
            sections: [
                { title: 'Antes de Empezar', content: 'Visita la escuela y conoce al maestro. Practica rutinas: despertar temprano, vestirse rápido. Lee libros sobre empezar la escuela.' },
                { title: 'Primeros Días', content: 'Despedidas breves y alegres. No te escabulas. Valida los miedos sin magnificarlos. Ten paciencia con regresiones.' },
                { title: 'Apoyo Continuo', content: 'Pregunta sobre su día (preguntas específicas). Comunica con la maestra. Mantén rutinas en casa. Tiempo de conexión después de la escuela.' }
            ],
            tips: ['Las despedidas largas aumentan la ansiedad', 'Llanto inicial es normal - generalmente se calman rápido', 'La adaptación toma semanas, no días', 'Celebra los pequeños éxitos', 'Tu actitud positiva importa mucho']
        }
    }
];

export const EARLY_SCHOOL_MODULES: GuideModule[] = [
    {
        id: 'early-school-intro', stageId: 'early-school', order: 1, title: 'Años Escolares', description: '5-7 años: Aprendizaje formal', icon: 'backpack', isPriority: true,
        content: {
            intro: 'Lectura, escritura, matemáticas. Amistades importantes. Mayor independencia. Conciencia social. El mundo se expande más allá del hogar.',
            sections: [
                { title: 'Aprendizaje Académico', content: 'Lee y escribe. Operaciones matemáticas básicas. Sigue instrucciones complejas. Trabaja en proyectos. Aprende de manera estructurada.' },
                { title: 'Desarrollo Social', content: 'Las amistades son muy importantes. Conciencia de reglas sociales. Puede sentir presión de pares. Desarrolla empatía y moralidad.' },
                { title: 'Independencia', content: 'Gestiona sus pertenencias. Completa tareas solo. Toma decisiones pequeñas. Maneja dinero (concepto básico). Mayor responsabilidad.' }
            ],
            tips: ['Mantén comunicación abierta sobre la escuela', 'Las amistades son muy importantes a esta edad', 'Fomenta independencia gradualmente', 'El esfuerzo importa más que las calificaciones']
        }
    },
    {
        id: 'early-school-feeding', stageId: 'early-school', order: 2, title: 'Nutrición Escolar', description: 'Loncheras y hábitos', icon: 'restaurant', isPriority: false,
        content: {
            intro: 'Loncheras saludables. Desayuno importante para la concentración. Hidratación durante el día.',
            sections: [
                { title: 'Desayuno', content: 'Impacta concentración y rendimiento. Proteína + carbohidratos complejos ideal. Evita azúcares simples que causan bajón de energía.' },
                { title: 'Lonchera', content: 'Incluye: proteína, fruta, verdura, carbohidrato, agua. Involúcralo en la preparación. Variedad para que no se aburra.' },
                { title: 'Hidratación', content: 'Agua como bebida principal. Botella reutilizable para la escuela. Limita jugos y evita refrescos. La sed afecta la concentración.' }
            ],
            tips: ['Prepara la lonchera la noche anterior', 'Deja que participe en las decisiones', 'Snacks saludables disponibles en casa', 'Modela buenos hábitos alimenticios']
        }
    },
    {
        id: 'early-school-sleep', stageId: 'early-school', order: 3, title: 'Sueño', description: '9-11 horas necesarias', icon: 'bedtime', isPriority: false,
        content: {
            intro: '9-11 horas de sueño son necesarias. La falta de sueño afecta aprendizaje, comportamiento y salud.',
            sections: [
                { title: 'Impacto del Sueño', content: 'El sueño consolida el aprendizaje. Afecta memoria, atención, humor. Niños cansados parecen hiperactivos. Impacta crecimiento.' },
                { title: 'Rutina', content: 'Misma hora cada noche (+/- 30 min fines de semana). Rutina calmante. Lectura antes de dormir. Sin pantallas 1 hora antes.' },
                { title: 'Problemas Comunes', content: 'Resistencia a dormir (actividades, tareas). Miedos nocturnos disminuyen. Sobre-programación afecta el sueño.' }
            ],
            tips: ['Calcula hora de dormir desde hora de despertar', 'La habitación: oscura, fresca, sin pantallas', 'Las tareas no deben robar horas de sueño', 'Fines de semana: no más de 1 hora de diferencia']
        }
    },
    {
        id: 'early-school-hygiene', stageId: 'early-school', order: 4, title: 'Higiene', description: 'Responsabilidad personal', icon: 'bathtub', isPriority: false,
        content: {
            intro: 'Se baña solo (supervisado ligeramente). Cuida sus pertenencias. Lavado de manos reforzado. Higiene como hábito propio.',
            sections: [
                { title: 'Autocuidado', content: 'Baño independiente (supervisión distante). Cepillado supervisado hasta los 8. Se peina. Elige ropa apropiada.' },
                { title: 'Responsabilidad', content: 'Cuida sus útiles escolares. Organiza su mochila. Mantiene su espacio ordenado. Pone ropa sucia en su lugar.' },
                { title: 'Salud', content: 'Lava manos frecuentemente. Cubre al toser/estornudar. No comparte artículos personales. Reconoce cuando no se siente bien.' }
            ],
            tips: ['Checklists visuales ayudan con rutinas', 'Deja que asuma consecuencias naturales (olvidar algo)', 'Celebra la responsabilidad', 'Supervisa sin hacer por él']
        }
    },
    {
        id: 'early-school-motor', stageId: 'early-school', order: 5, title: 'Desarrollo Motor', description: 'Deportes y escritura', icon: 'accessibility_new', isPriority: false,
        content: {
            intro: 'Deportes organizados. Escritura más fluida y legible. Instrumentos musicales posibles. Coordinación refinada.',
            sections: [
                { title: 'Deportes', content: 'Puede participar en deportes organizados. Reglas y trabajo en equipo. Natación, fútbol, gimnasia populares. El objetivo es diversión y movimiento.' },
                { title: 'Escritura', content: 'Letra más legible. Velocidad aumenta. Puede cansarse con escritura larga. Algunos problemas de agarre aún posibles.' },
                { title: 'Artes y Música', content: 'Buen momento para instrumentos. Artes plásticas más elaboradas. Danza y teatro expresan creatividad.' }
            ],
            tips: ['El deporte debe ser divertido, no competitivo a esta edad', 'Si le cuesta escribir, consulta', 'Deja que explore antes de especializarse', 'El movimiento ayuda al aprendizaje']
        }
    },
    {
        id: 'early-school-cognitive', stageId: 'early-school', order: 6, title: 'Desarrollo Cognitivo', description: 'Lectura y lógica', icon: 'psychology', isPriority: false,
        content: {
            intro: 'Lee de forma independiente. Operaciones matemáticas. Pensamiento lógico. Resolución de problemas más compleja.',
            sections: [
                { title: 'Lectura', content: 'Lee libros por capítulos. Comprensión lectora. Disfruta leer solo. Variedad de géneros. La lectura es puerta a todo aprendizaje.' },
                { title: 'Matemáticas', content: 'Suma, resta, inicio de multiplicación. Problemas de palabras. Pensamiento lógico. Conceptos de dinero y tiempo.' },
                { title: 'Pensamiento', content: 'Entiende causa y efecto. Planifica pasos. Resuelve problemas creativamente. Pensamiento abstracto emerge.' }
            ],
            tips: ['Lee con él aunque lea solo', 'Las matemáticas están en la vida diaria', 'Los juegos de mesa desarrollan lógica', 'Fomenta curiosidad, no solo respuestas correctas']
        }
    },
    {
        id: 'early-school-health', stageId: 'early-school', order: 7, title: 'Salud', description: 'Chequeos escolares', icon: 'vaccines', isPriority: false,
        content: {
            intro: 'Chequeo anual. Control de visión importante. Salud dental. Postura al sentarse y con mochila.',
            sections: [
                { title: 'Chequeos Anuales', content: 'Evaluación general. Peso/talla apropiados. Desarrollo en progreso. Vacunas al día.' },
                { title: 'Visión', content: 'Muy importante para la lectura. Señales: acercarse mucho, dolor de cabeza, entrecerrar ojos. Examen anual recomendado.' },
                { title: 'Postura y Ergonomía', content: 'Mochila no más del 15% del peso corporal. Postura al escribir. Descansos de pantalla. Silla y escritorio apropiados.' }
            ],
            warningSignals: ['Dolores de cabeza frecuentes', 'Dificultad para ver el pizarrón', 'Fatiga excesiva', 'Cambios de humor persistentes']
        }
    },
    {
        id: 'early-school-stimulation', stageId: 'early-school', order: 8, title: 'Actividades Extracurriculares', description: 'Equilibrio y pasiones', icon: 'toys', isPriority: false,
        content: {
            intro: 'Deportes, arte, música. Evita sobre-programar. El tiempo libre para jugar sigue siendo importante.',
            sections: [
                { title: 'Beneficios', content: 'Descubre intereses. Desarrolla habilidades. Socialización fuera de la escuela. Autoestima. Manejo del tiempo.' },
                { title: 'Equilibrio', content: 'No sobre-programar. Tiempo para juego libre. Tiempo en familia. Tareas. Descanso. El aburrimiento también es valioso.' },
                { title: 'Elección', content: 'Deja que explore diferentes opciones. Compromiso razonable (un semestre). Está bien cambiar de actividad. Sigue su pasión, no la tuya.' }
            ],
            tips: ['Una o dos actividades es suficiente', 'El juego libre desarrolla creatividad', 'No proyectes tus sueños no cumplidos', 'Observa señales de estrés por sobre-programación']
        }
    },
    {
        id: 'early-school-warning', stageId: 'early-school', order: 9, title: 'Señales de Alerta', description: 'Dificultades de aprendizaje', icon: 'warning', isPriority: true,
        content: {
            intro: 'Las dificultades de aprendizaje son más visibles en estos años. La detección temprana permite intervenciones efectivas.',
            sections: [
                { title: 'Académico', content: 'Dificultad persistente con lectura (dislexia posible). Problemas con matemáticas. Escritura ilegible persistente. Evita tareas escolares.' },
                { title: 'Atención', content: 'No puede concentrarse. Se distrae fácilmente. Olvida instrucciones. Pierde cosas constantemente. Impulsividad. Puede ser TDAH.' },
                { title: 'Social/Emocional', content: 'Rechazo a la escuela persistente. Aislamiento. Bullying (víctima o agresor). Ansiedad escolar. Cambios de comportamiento.' }
            ],
            warningSignals: ['Dificultad persistente para leer/escribir', 'Problemas de atención significativos', 'Rechazo a ir a la escuela', 'Aislamiento social', 'Ansiedad o tristeza persistente']
        }
    },
    {
        id: 'early-school-tips', stageId: 'early-school', order: 10, title: 'Tips: Apoyo Escolar', description: 'Tareas y motivación', icon: 'lightbulb', isPriority: true,
        content: {
            intro: 'El apoyo en casa hace una diferencia enorme. Involucrarse sin hacer por él. Celebrar el esfuerzo, no solo resultados.',
            sections: [
                { title: 'Ambiente de Tareas', content: 'Espacio tranquilo y organizado. Materiales disponibles. Sin distracciones (TV, teléfono). Horario consistente.' },
                { title: 'Involucramiento', content: 'Pregunta sobre su día (preguntas específicas, no solo "¿Cómo te fue?"). Revisa pero no hagas por él. Comunica con maestros.' },
                { title: 'Motivación', content: 'Celebra esfuerzo, no solo resultados. Evita comparaciones. Ayúdalo a establecer metas. Conecta aprendizaje con intereses.' }
            ],
            tips: ['Las tareas son responsabilidad del niño, no tuya', 'Estar disponible no es hacer por él', 'La lectura juntos continúa siendo valiosa', 'Las calificaciones no definen su valor', 'Fomenta mentalidad de crecimiento: "Aún no lo dominas"']
        }
    }
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

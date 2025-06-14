"use client";
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Baby, Syringe, AlertTriangle, Plus, X, Bell, CheckCircle, TrendingUp } from 'lucide-react';
import styles from './page.module.css';

// Eduardo Correia

interface VacinaCalendario {
    nome: string;
    idade: string;
    diasApos: number;
    descricao: string;
}

interface VacinaCalculada extends VacinaCalendario {
    dataVacina: Date;
    diasParaVacina: number;
    status: 'urgente' | 'proxima' | 'aplicada' | 'atrasada' | 'futura';
    aplicada: boolean;
    id: string;
}

interface EstatisticasVacinas {
    total: number;
    aplicadas: number;
    atrasadas: number;
    urgentes: number;
    percentualCompleto: number;
}

interface ProximaVacina {
    vacina: VacinaCalculada | null;
    diasRestantes: number;
}

const CalendarioVacinacao = () => {
    const [dataNascimento, setDataNascimento] = useState('');
    const [vacinas, setVacinas] = useState<VacinaCalculada[]>([]);
    const [mostrarTodas, setMostrarTodas] = useState(false);

    const calendarioVacinas: VacinaCalendario[] = [
        // Ao nascer
        { nome: 'BCG', idade: '0 meses', diasApos: 0, descricao: 'Tuberculose' },
        { nome: 'Hepatite B (1ª dose)', idade: '0 meses', diasApos: 0, descricao: 'Hepatite B' },

        // 2 meses
        { nome: 'Pentavalente (1ª dose)', idade: '2 meses', diasApos: 60, descricao: 'DTP + Hib + Hepatite B' },
        { nome: 'VIP (1ª dose)', idade: '2 meses', diasApos: 60, descricao: 'Poliomielite inativada' },
        { nome: 'Pneumocócica 10V (1ª dose)', idade: '2 meses', diasApos: 60, descricao: 'Pneumonia e meningite' },
        { nome: 'Rotavírus (1ª dose)', idade: '2 meses', diasApos: 60, descricao: 'Diarreia por rotavírus' },

        // 3 meses
        { nome: 'Meningocócica C (1ª dose)', idade: '3 meses', diasApos: 90, descricao: 'Meningite meningocócica' },

        // 4 meses
        { nome: 'Pentavalente (2ª dose)', idade: '4 meses', diasApos: 120, descricao: 'DTP + Hib + Hepatite B' },
        { nome: 'VIP (2ª dose)', idade: '4 meses', diasApos: 120, descricao: 'Poliomielite inativada' },
        { nome: 'Pneumocócica 10V (2ª dose)', idade: '4 meses', diasApos: 120, descricao: 'Pneumonia e meningite' },
        { nome: 'Rotavírus (2ª dose)', idade: '4 meses', diasApos: 120, descricao: 'Diarreia por rotavírus' },

        // 5 meses
        { nome: 'Meningocócica C (2ª dose)', idade: '5 meses', diasApos: 150, descricao: 'Meningite meningocócica' },

        // 6 meses
        { nome: 'Pentavalente (3ª dose)', idade: '6 meses', diasApos: 180, descricao: 'DTP + Hib + Hepatite B' },
        { nome: 'VIP (3ª dose)', idade: '6 meses', diasApos: 180, descricao: 'Poliomielite inativada' },
        { nome: 'Pneumocócica 10V (3ª dose)', idade: '6 meses', diasApos: 180, descricao: 'Pneumonia e meningite' },

        // 9 meses
        { nome: 'Febre Amarela', idade: '9 meses', diasApos: 270, descricao: 'Febre amarela' },

        // 12 meses
        { nome: 'Tríplice Viral (1ª dose)', idade: '12 meses', diasApos: 365, descricao: 'Sarampo, caxumba e rubéola' },
        { nome: 'Pneumocócica 10V (reforço)', idade: '12 meses', diasApos: 365, descricao: 'Pneumonia e meningite' },
        { nome: 'Meningocócica C (reforço)', idade: '12 meses', diasApos: 365, descricao: 'Meningite meningocócica' },

        // 15 meses
        { nome: 'DTP (1º reforço)', idade: '15 meses', diasApos: 450, descricao: 'Difteria, tétano e coqueluche' },
        { nome: 'VOP (1º reforço)', idade: '15 meses', diasApos: 450, descricao: 'Poliomielite oral' },
        { nome: 'Hepatite A', idade: '15 meses', diasApos: 450, descricao: 'Hepatite A' },
        { nome: 'Tetra Viral', idade: '15 meses', diasApos: 450, descricao: 'Sarampo, caxumba, rubéola e varicela' },

        // 4 anos
        { nome: 'DTP (2º reforço)', idade: '4 anos', diasApos: 1460, descricao: 'Difteria, tétano e coqueluche' },
        { nome: 'VOP (2º reforço)', idade: '4 anos', diasApos: 1460, descricao: 'Poliomielite oral' },
        { nome: 'Varicela (reforço)', idade: '4 anos', diasApos: 1460, descricao: 'Catapora' }
    ];

    const calcularVacinas = React.useCallback(() => {
        const nascimento = new Date(dataNascimento);
        const hoje = new Date();

        const vacinasCalculadas: VacinaCalculada[] = calendarioVacinas.map(vacina => {
            const dataVacina = new Date(nascimento);
            dataVacina.setDate(nascimento.getDate() + vacina.diasApos);

            const diasParaVacina = Math.ceil((dataVacina.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));

            let status: VacinaCalculada['status'] = 'futura';
            if (diasParaVacina < 0) {
                status = Math.abs(diasParaVacina) > 30 ? 'atrasada' : 'urgente';
            } else if (diasParaVacina <= 7) {
                status = 'urgente';
            } else if (diasParaVacina <= 30) {
                status = 'proxima';
            }

            return {
                ...vacina,
                dataVacina,
                diasParaVacina,
                status,
                aplicada: false,
                id: Math.random().toString(36).substr(2, 9)
            };
        });

        setVacinas(vacinasCalculadas.sort((a, b) => a.dataVacina.getTime() - b.dataVacina.getTime()));
    }, [dataNascimento]);

    useEffect(() => {
        if (dataNascimento) {
            calcularVacinas();
        }
    }, [dataNascimento, calcularVacinas]);

    const marcarComoAplicada = (id: string) => {
        setVacinas(prevVacinas => prevVacinas.map(vacina =>
            vacina.id === id ? { ...vacina, aplicada: true, status: 'aplicada' as const } : vacina
        ));
    };

    const removerVacina = (id: string) => {
        setVacinas(prevVacinas => prevVacinas.filter(vacina => vacina.id !== id));
    };

    // Calcular estatísticas
    const calcularEstatisticas = (): EstatisticasVacinas => {
        const hoje = new Date();
        const vacinasRelevantes = vacinas.filter(v => v.dataVacina <= hoje || v.aplicada);

        return {
            total: vacinasRelevantes.length,
            aplicadas: vacinas.filter(v => v.aplicada).length,
            atrasadas: vacinas.filter(v => v.status === 'atrasada').length,
            urgentes: vacinas.filter(v => v.status === 'urgente' && !v.aplicada).length,
            percentualCompleto: vacinasRelevantes.length > 0 ? Math.round((vacinas.filter(v => v.aplicada).length / vacinasRelevantes.length) * 100) : 0
        };
    };

    // Encontrar próxima vacina
    const encontrarProximaVacina = (): ProximaVacina => {
        const vacinasNaoAplicadas = vacinas.filter(v => !v.aplicada && v.status !== 'atrasada');
        const proximaVacina = vacinasNaoAplicadas.length > 0 ? vacinasNaoAplicadas[0] : null;

        return {
            vacina: proximaVacina,
            diasRestantes: proximaVacina ? proximaVacina.diasParaVacina : 0
        };
    };

    const getStatusClass = (status: VacinaCalculada['status']): string => {
        switch (status) {
            case 'urgente': return styles.vaccineUrgent;
            case 'proxima': return styles.vaccineUpcoming;
            case 'aplicada': return styles.vaccineCompleted;
            case 'atrasada': return styles.vaccineLate;
            default: return '';
        }
    };

    const getStatusText = (status: VacinaCalculada['status']): string => {
        switch (status) {
            case 'urgente': return 'Urgente';
            case 'proxima': return 'Próxima';
            case 'aplicada': return 'Aplicada';
            case 'atrasada': return 'Atrasada';
            case 'futura': return 'Futura';
            default: return '';
        }
    };

    const getStatusTextClass = (status: VacinaCalculada['status']): string => {
        switch (status) {
            case 'urgente': return styles.statusUrgent;
            case 'proxima': return styles.statusUpcoming;
            case 'aplicada': return styles.statusCompleted;
            case 'atrasada': return styles.statusLate;
            default: return styles.statusUpcoming;
        }
    };

    const getIconClass = (status: VacinaCalculada['status']): string => {
        switch (status) {
            case 'urgente': return styles.iconUrgent;
            case 'proxima': return styles.iconUpcoming;
            case 'aplicada': return styles.iconCompleted;
            case 'atrasada': return styles.iconLate;
            default: return styles.iconUpcoming;
        }
    };

    const formatarData = (data: Date): string => {
        return data.toLocaleDateString('pt-BR');
    };

    const formatarIdade = (dataNascimento: string): string => {
        if (!dataNascimento) return '';

        const nascimento = new Date(dataNascimento);
        const hoje = new Date();
        const diffTime = hoje.getTime() - nascimento.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 30) {
            return `${diffDays} dia${diffDays !== 1 ? 's' : ''}`;
        } else if (diffDays < 365) {
            const meses = Math.floor(diffDays / 30);
            return `${meses} mês${meses !== 1 ? 'es' : ''}`;
        } else {
            const anos = Math.floor(diffDays / 365);
            const mesesRestantes = Math.floor((diffDays % 365) / 30);
            return `${anos} ano${anos !== 1 ? 's' : ''}${mesesRestantes > 0 ? ` e ${mesesRestantes} mês${mesesRestantes !== 1 ? 'es' : ''}` : ''}`;
        }
    };

    const vacinasParaExibir = mostrarTodas
        ? vacinas
        : vacinas.filter((vacina: VacinaCalculada) =>
            vacina.status === 'urgente' ||
            vacina.status === 'proxima' ||
            vacina.status === 'atrasada' ||
            vacina.aplicada
        );

    const estatisticas = calcularEstatisticas();
    const proximaVacina = encontrarProximaVacina();

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.headerTitle}>
                    <Baby className="inline-block mr-3" size={48} />
                    Calendário de Vacinação
                </h1>
                <p className={styles.headerSubtitle}>
                    Acompanhe as vacinas do seu bebê de forma organizada e nunca perca um prazo
                </p>
            </header>

            <div className={styles.configForm}>
                <div className={styles.formGroup}>
                    <label htmlFor="dataNascimento" className={styles.formLabel}>
                        <Calendar className="inline-block mr-2" size={20} />
                        Data de Nascimento do Bebê
                    </label>
                    <input
                        type="date"
                        id="dataNascimento"
                        value={dataNascimento}
                        onChange={(e) => setDataNascimento(e.target.value)}
                        className={styles.formInput}
                        max={new Date().toISOString().split('T')[0]}
                    />
                </div>

                {dataNascimento && (
                    <div className="flex gap-4 flex-wrap">
                        <button
                            onClick={calcularVacinas}
                            className={styles.btnPrimary}
                            type="button"
                        >
                            <Plus size={20} />
                            Gerar Calendário
                        </button>
                        <button
                            onClick={() => setMostrarTodas(!mostrarTodas)}
                            className={styles.btnSecondary}
                            type="button"
                        >
                            <Calendar size={20} />
                            {mostrarTodas ? 'Mostrar Prioritárias' : 'Mostrar Todas'}
                        </button>
                    </div>
                )}
            </div>

            {dataNascimento && vacinas.length > 0 && (
                <>
                    {/* Painel de Informações */}
                    <div className={styles.infoPanel}>
                        <div className={styles.babyInfo}>
                            <Baby size={24} />
                            <div>
                                <h3>Idade do bebê</h3>
                                <p>{formatarIdade(dataNascimento)}</p>
                            </div>
                        </div>

                        {/* Próxima Vacina */}
                        {proximaVacina.vacina && (
                            <div className={styles.nextVaccineCard}>
                                <div className={styles.nextVaccineHeader}>
                                    <Bell size={20} />
                                    <h3>Próxima Vacina</h3>
                                </div>
                                <div className={styles.nextVaccineContent}>
                                    <h4>{proximaVacina.vacina.nome}</h4>
                                    <p className={styles.nextVaccineDate}>
                                        {formatarData(proximaVacina.vacina.dataVacina)}
                                    </p>
                                    <p className={styles.nextVaccineDays}>
                                        {proximaVacina.diasRestantes > 0
                                            ? `Em ${proximaVacina.diasRestantes} dias`
                                            : proximaVacina.diasRestantes === 0
                                                ? 'Hoje!'
                                                : 'Atrasada'
                                        }
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Estatísticas */}
                        <div className={styles.statsGrid}>
                            <div className={styles.statCard}>
                                <CheckCircle size={20} />
                                <div>
                                    <span className={styles.statNumber}>{estatisticas.aplicadas}</span>
                                    <span className={styles.statLabel}>Aplicadas</span>
                                </div>
                            </div>
                            <div className={styles.statCard}>
                                <AlertTriangle size={20} />
                                <div>
                                    <span className={styles.statNumber}>{estatisticas.atrasadas + estatisticas.urgentes}</span>
                                    <span className={styles.statLabel}>Pendentes</span>
                                </div>
                            </div>
                            <div className={styles.statCard}>
                                <TrendingUp size={20} />
                                <div>
                                    <span className={styles.statNumber}>{estatisticas.percentualCompleto}%</span>
                                    <span className={styles.statLabel}>Completo</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {vacinasParaExibir.length > 0 ? (
                <div className={styles.vaccineGrid}>
                    {vacinasParaExibir.map(vacina => (
                        <div
                            key={vacina.id}
                            className={`${styles.vaccineCard} ${getStatusClass(vacina.status)}`}
                        >
                            <div className={styles.vaccineHeader}>
                                <div className="flex items-start flex-1">
                                    <div className={`${styles.vaccineIcon} ${getIconClass(vacina.status)}`}>
                                        <Syringe size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={styles.vaccineTitle}>{vacina.nome}</h3>
                                        <p className={styles.vaccineAge}>{vacina.idade}</p>
                                    </div>
                                </div>
                                <span className={`${styles.vaccineStatus} ${getStatusTextClass(vacina.status)}`}>
                                    {vacina.status === 'urgente' && <AlertTriangle size={14} />}
                                    {vacina.status === 'atrasada' && <AlertTriangle size={14} />}
                                    {vacina.status === 'proxima' && <Clock size={14} />}
                                    {vacina.status === 'aplicada' && <Syringe size={14} />}
                                    {getStatusText(vacina.status)}
                                </span>
                            </div>

                            <div className={styles.vaccineInfo}>
                                <div className={styles.vaccineDate}>
                                    <Calendar size={16} />
                                    <span>Data: {formatarData(vacina.dataVacina)}</span>
                                </div>
                                <p className={styles.vaccineDescription}>
                                    {vacina.descricao}
                                </p>
                                {vacina.status === 'atrasada' && (
                                    <p className={styles.vaccineWarning}>
                                        ⚠️ Atrasada há {Math.abs(vacina.diasParaVacina)} dias
                                    </p>
                                )}
                                {vacina.status === 'urgente' && vacina.diasParaVacina >= 0 && (
                                    <p className={styles.vaccineUrgentText}>
                                        🕐 Faltam {vacina.diasParaVacina} dias
                                    </p>
                                )}
                                {vacina.status === 'proxima' && (
                                    <p className={styles.vaccineUpcomingText}>
                                        📅 Faltam {vacina.diasParaVacina} dias
                                    </p>
                                )}
                            </div>

                            {!vacina.aplicada && (
                                <div className={styles.vaccineActions}>
                                    <button
                                        onClick={() => marcarComoAplicada(vacina.id)}
                                        className={`${styles.btnAction} ${styles.btnComplete}`}
                                        type="button"
                                    >
                                        <Syringe size={16} />
                                        Marcar como Aplicada
                                    </button>
                                    <button
                                        onClick={() => removerVacina(vacina.id)}
                                        className={`${styles.btnAction} ${styles.btnRemove}`}
                                        type="button"
                                    >
                                        <X size={16} />
                                        Remover
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : dataNascimento ? (
                <div className={styles.emptyState}>
                    <Baby className={styles.emptyStateIcon} size={64} />
                    <h3 className={styles.emptyStateTitle}>Calendário Calculado!</h3>
                    <p className={styles.emptyStateText}>
                        {mostrarTodas
                            ? 'Nenhuma vacina encontrada.'
                            : 'Todas as vacinas estão em dia ou são muito futuras. Clique em "Mostrar Todas" para ver o calendário completo.'
                        }
                    </p>
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <Calendar className={styles.emptyStateIcon} size={64} />
                    <h3 className={styles.emptyStateTitle}>Bem-vindo!</h3>
                    <p className={styles.emptyStateText}>
                        Digite a data de nascimento do seu bebê para começar a acompanhar
                        o calendário de vacinação personalizado.
                    </p>
                </div>
            )}
        </div>
    );
};

export default CalendarioVacinacao;
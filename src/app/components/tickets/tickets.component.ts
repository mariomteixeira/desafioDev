import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ITickets } from "../../interface/ITickets";
import { AuthService } from "src/app/services/authservice.service";

@Component({ selector: 'post-request', templateUrl: './tickets.component.html', styleUrls: ['./tickets.component.css'] })
export class TicketComponent implements OnInit {
  isDesc: boolean = false;
  viewingTicketId: number | null = null;
  showDetails: boolean = false;
  // global state dos inputs
  selectedFields: any = {
    situacao: false,
    Usuario: false,
    idprioridade: false,
    nota: false,
  }

  // Função para resetar os filtros para os valores originais e resetar a table para o estado inicial
  resetFilters(): void {
  this.filterOrigemAtendimento = '';
  this.filterSituacao = '';
    this.filterUsuario = '';
    this.filteridPrioridade = '';
    this.filterIdSolicitacao = '';
    this.filterNota = '';
    this.filteredTickets = [];
  }

  toggleView(ticketId: number): void {
    this.viewingTicketId = this.viewingTicketId === ticketId ? null : ticketId;
  }

  toggleDetails(ticket: ITickets): void {
    ticket.showDetails = !ticket.showDetails;
  }

  // opções de filtros
  filteredTickets: ITickets[] = [];

  optionsOrigemAtendimento: string[] = [
    '2º Nível',
    '3º Nivel',
    'E-mail',
    'Facebook',
    'Internet',
    'Portal de Serviços',
    'Service Desk',
    'Twitter',
  ];
  optionsNota: string[] = ['Ruim', 'Regular', 'Bom', 'Ótimo', 'Sem Avaliação'];
  optionsSituacao: string[] = ['Em andamento', 'Fechada', 'Cancelada'];
  uniqueUsers: string[] = [];
  uniqueIds: number[] = [];
  
  sessionToken: string = '';
  filterOrigemAtendimento: string = '';
  filterSituacao: string = '';
  filterUsuario: string = '';
  filteridPrioridade: string = '';
  filterIdSolicitacao: string = '';
  filterNota: string = '';
  p: number = 1;
  itemsPerPage: number = 10;
  column: string = '';

  url = "https://gsm-hmg.centralitcloud.com.br/citsmart/services/data/query"

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Iniciar a rota /tickets com os usuários únicos carregados.
  ngOnInit(): void {
    const sessionToken = this.authService.getSessionToken();
    if (sessionToken) {
      this.loadUniqueUsers(sessionToken);
    }
  }

  sortTable(property: string): void {
    // Alternar entre ascendente e descendente
    this.isDesc = !this.isDesc;
    this.column = property;
    let direction = this.isDesc ? 1 : -1;

    // Fazer a ordenação dos tickets
    this.filteredTickets.sort((a: any, b: any) => {
      if (a[property] < b[property]) {
        return -1 * direction;
      } else if (a[property] > b[property]) {
        return 1 * direction;
      } else {
        return 0;
      }
    });
  }

  loadUniqueUsers(sessionToken: string) {
    const body = {
      sessionID: sessionToken,
      queryName: 'DESAFIODEV',
      fields: ['Usuario'],
    };
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
  
    this.http.post(this.url, body, { headers }).subscribe((response: any) => {
      if (response && response.result && Array.isArray(response.result)) {
        // Usar um Set para armazenar usuários únicos
        const uniqueUserSet = new Set(response.result.map((ticket: any) => ticket.Usuario));
        // Converter o Set de volta para um array de strings
        this.uniqueUsers = Array.from(uniqueUserSet) as string[];
      }
    }, (error: any) => {
      console.log('Erro ao carregar usuários únicos: ', error);
    });
  }

  postRequest() {
    const sessionToken = this.authService.getSessionToken();
    if (!sessionToken) {
      console.log('Token inválido');
      return;
    }
    const selectedFields = Object.keys(this.selectedFields).filter((key: string) => this.selectedFields[key]);
  
    const body = {
      sessionID: sessionToken,
      queryName: 'DESAFIODEV',
      fields: selectedFields,
    };
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
  
    this.http.post(this.url, body, { headers }).subscribe((response: any) => {
      console.log('Teste de resposta da API: ', response);
  
      // Inicialize filteredTickets com todos os tickets da API
      this.filteredTickets = response.result;
  
      // Aplicar o filtro de situação se estiver definido
      if (this.filterSituacao) {
        this.filteredTickets = this.filteredTickets.filter((ticket: any) => {
          return ticket.situacao === this.filterSituacao;
        });
      }
  
      // Aplicar o filtro de prioridade se estiver definido
      if (this.filteridPrioridade) {
        this.filteredTickets = this.filteredTickets.filter((ticket: any) => {
          return ticket.idprioridade === parseInt(this.filteridPrioridade);
        });
      }
  
      // Aplicar o filtro de usuário se estiver definido
      if (this.filterUsuario) {
        this.filteredTickets = this.filteredTickets.filter((ticket: any) => {
          return ticket.Usuario === this.filterUsuario;
        });
      }

      // Aplicar o filtro de Origem do Atendimento se estiver definido
      if (this.filterOrigemAtendimento) {
        this.filteredTickets = this.filteredTickets.filter((ticket: any) => {
          return ticket.OrigemAtendimento === this.filterOrigemAtendimento;
        });
      }

      // Aplicar o filtro de ID da Solicitação se estiver definido
      if (this.filterIdSolicitacao) {
        this.filteredTickets = this.filteredTickets.filter((ticket: any) => {
          return ticket.idsolicitacaoservico === parseInt(this.filterIdSolicitacao);
        });
      }

      // Aplicar o filtro de Nota se estiver definido
      if (this.filterNota) {
        this.filteredTickets = this.filteredTickets.filter((ticket: any) => {
          return ticket.nota === this.filterNota;
        });
      }

      console.log('Retorno filtrado de usuários: ', this.uniqueUsers);
      console.log('Retorno filtrado da API: ', this.filteredTickets);
    }, (error: any) => {
      console.log('Erro ao chamar a API: ', error);
    });
  }
}

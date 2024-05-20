/* eslint-disable no-console */
import { HomeAssistant, hasConfigOrEntityChanged } from 'custom-card-helpers';
import { CSSResultGroup, LitElement, PropertyValues, TemplateResult, css, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { PublicTransportVictoriaAttributes, PublicTransportVictoriaCardConfig } from './types';

class PublicTransportVictoriaCard extends LitElement {
  @property({ attribute: false }) accessor hass!: HomeAssistant;

  @state() private config!: PublicTransportVictoriaCardConfig;

  public setConfig(config: PublicTransportVictoriaCardConfig): void {
    if (!config?.entity) {
      throw new Error('You need to define an entity');
    }

    this.config = config;
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (!this.config) {
      return false;
    }

    console.log('shouldUpdate:', hasConfigOrEntityChanged(this, changedProps, false));

    return hasConfigOrEntityChanged(this, changedProps, false);
  }

  protected getEntity(entityName): any | void {
    if (this.hass && entityName in this.hass.states) {
      return this.hass.states[entityName];
    }
  }

  private getResponseAttributes(entity: any): null | PublicTransportVictoriaAttributes {
    if (entity?.attributes) {
      return entity.attributes as PublicTransportVictoriaAttributes;
    }

    return null;
  }

  private formatTime(datetime: string): string {
    const date = new Date(datetime);

    const padTime = (time: number) => {
      return String(time).padStart(2, '0');
    };

    return `${padTime(date.getHours())}:${padTime(date.getMinutes())}`;
  }

  private getDelayedTimeInMinutes(entity): number | null {
    const attributes = this.getResponseAttributes(entity);

    if (!attributes?.scheduled_departure_utc || !attributes?.estimated_departure_utc) {
      return null;
    }

    const scheduledTime = new Date(attributes.scheduled_departure_utc);

    const estimatedTime = new Date(attributes.estimated_departure_utc);

    const diffInMinutes = Math.floor(
      (estimatedTime.valueOf() - scheduledTime.valueOf()) / 1000 / 60
    );

    console.log(diffInMinutes);

    return diffInMinutes;
  }

  private getStatus(entity): 'on-time' | 'delayed' | 'cancelled' | null {
    const attributes = this.getResponseAttributes(entity);

    if (!attributes?.scheduled_departure_utc) {
      return null;
    }

    if (!attributes.estimated_departure_utc) {
      return 'cancelled';
    }

    const delayTimeInMinutes = this.getDelayedTimeInMinutes(entity);

    return delayTimeInMinutes === 0 ? 'on-time' : 'delayed';
  }

  private getNextServices(entityName: string): any[] | null {
    if (!entityName.endsWith('0')) {
      return null;
    }

    const baseEntityName = entityName.slice(0, -1);

    const entities: any = [];

    for (let i = 1; i < 5; i++) {
      const entity = this.getEntity(`${baseEntityName}${i}`);

      if (entity?.attributes) {
        entities.push(entity);
      }
    }

    return entities.length > 0 ? entities : null;
  }

  private _renderNextServices(entity): TemplateResult | void {
    const entityName = entity.entity_id;

    const nextServices = this.getNextServices(entityName);

    console.log(nextServices);

    if (!nextServices) {
      return;
    }

    return html`<div class="next-services">
      Next services:
      ${nextServices.map(service => {
        const attributes = this.getResponseAttributes(service)!;

        const status = this.getStatus(service);

        const delay = this.getDelayedTimeInMinutes(service);

        return html`
          <div class="next-service">
            <div class="next-service-time">
              ${this.formatTime(attributes?.scheduled_departure_utc)}
            </div>
            ${status === 'delayed' && delay
              ? html`<div class="service-delayed">
                  <ha-icon icon="mdi:clock-alert-outline"></ha-icon>
                  <div class="delay-label">+ ${delay}</div>
                </div>`
              : ''}
            <div class="next-service-status service-status-${status}">${status}</div>
          </div>
        `;
      })}
    </div>`;
  }

  private _renderServiceTimes(entity): TemplateResult | void {
    const attributes = this.getResponseAttributes(entity);

    let arrival, departure;

    if (attributes?.scheduled_departure_utc) {
      departure = html` <div class="train-times__col">
        <div class="train-times__title">Scheduled</div>
        <div class="train-times__time">${this.formatTime(attributes?.scheduled_departure_utc)}</div>
      </div>`;
    }

    if (attributes?.estimated_departure_utc) {
      arrival = html` <div class="train-times__col">
        <div class="train-times__title">Actual</div>
        <div class="train-times__time">${this.formatTime(attributes?.estimated_departure_utc)}</div>
      </div>`;
    }

    if (arrival || departure) {
      return html`<div class="train-times">${departure} ${arrival}</div>`;
    }
  }

  private _renderServiceStatus(entity): TemplateResult | void {
    const status = this.getStatus(entity);

    if (!status) {
      return;
    }

    if (status === 'cancelled') {
      return html`<ha-alert alert-type="error">Next service suspended</ha-alert>`;
    }

    if (status === 'delayed') {
      return html`<ha-alert alert-type="warning">Next service delayed</ha-alert>`;
    }

    return html`<ha-alert alert-type="success">
      <ha-icon class="title_icon" icon="mdi:bus-clock"></ha-icon>On time</ha-alert
    >`;
  }

  protected _renderLastUpdated(): TemplateResult | void {
    const entity = this.getEntity(this.config.entity);

    if (entity && entity.last_updated) {
      const date = new Date(entity.last_updated);

      return html`<div class="last_updated">
        Last Updated: <span class="date">${date.toLocaleString()}</span>
      </div>`;
    }
  }

  private formatFriendlyName(friendyName: string | undefined): string | null {
    if (friendyName) {
      return friendyName.slice(0, -1).trim();
    }

    return null;
  }

  protected render(): TemplateResult | void {
    const entity = this.getEntity(this.config.entity);

    if (!entity) {
      return;
    }

    return html`
      <ha-card
        .label=${`'Public Transport Victoria': ${this.config.entity || 'No Entity Defined'}`}
      >
        <div class="card-content ${this.config.theme}_theme">
          <div class="title">
            <ha-icon class="title_icon" icon="mdi:train-bus"></ha-icon>
            <div class="title_inner">
              ${this.config.name
                ? this.config.name
                : entity
                  ? this.formatFriendlyName(entity.attributes.friendly_name)
                  : 'Public Transport Victoria'}
            </div>
            1
          </div>
          ${this._renderServiceStatus(entity)} ${this._renderServiceTimes(entity)}
          ${this._renderNextServices(entity)}
          ${html`<div class="content-footer">${this._renderLastUpdated()}</div>`}
        </div>
      </ha-card>
    `;
  }

  static get styles(): CSSResultGroup {
    return css`
      .title {
        font-weight: bold;
        display: flex;
        gap: 8px;
        margin-bottom: 20px;
      }

      ha-alert {
        margin-top: 8px;
      }

      .train-times {
        display: flex;
        gap: 8px;
        align-items: center;
        text-align: center;
        margin-top: 8px;
        position: relative;
        flex-wrap: wrap;
        font-weight: bold;
      }

      .train-times .train-times__time {
        font-weight: normal;
        font-size: larger;
      }

      .train-times .train-times__col {
        border-radius: 5px;
        padding: 8px;
        flex: 1;
      }

      .train-times .train-times__col h2 {
        margin: 0;
        margin-bottom: 8px;
      }

      .last_updated {
        margin-top: 14px;
        text-align: right;
        font-size: 0.8em;
      }

      .last_updated .date {
        font-style: italic;
      }

      .next-services {
        margin-top: 30px;
        font-size: 18px;
        font-weight: bold;
      }

      .next-service {
        margin-top: 4px;
        display: flex;
        flex-direction: row;
        font-size: 14px;
        background: var(--input-fill-color);
        justify-content: end;
        padding: 10px;
      }

      .service-delayed {
        color: var(--warning-color);
      }

      .next-service-status {
        margin-left: 20px;
        text-transform: capitalize;
      }

      .service-status-cancelled {
        color: var(--error-color);
      }

      .service-status-on-time {
        color: var(--success-color);
      }

      .service-status-delayed {
        color: var(--warning-color);
      }

      /* Colours */
      .train-times .train-times__col .arrow {
        color: var(--secondary-text-color);
      }
      .train-times .train-times__col {
        background: var(--input-fill-color);
      }
    `;
  }
}

customElements.define('public-transport-victoria-card', PublicTransportVictoriaCard);

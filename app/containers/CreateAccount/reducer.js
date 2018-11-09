import { fromJS } from "immutable";
import {
  CLOSE_MODAL,
  CHANGE_VALUE,
  SET_VALID,
  SET_INVALID,
  VALIDATE,
  SET_BANK_DETAILS,
  SET_UPLOAD_DOCUMENT,
  CLEAR_CURRENT_ACCOUNT
} from "./constants";

const initialFieldState = {
  value: "",
  validated: false,
  validating: false,
  errors: []
};
const initialValidFieldState = {
  value: "",
  validated: true,
  validating: true,
  errors: []
};
const initialState = fromJS({
  fields: {
    acNumber: { ...initialFieldState },
    routingNumber: { ...initialFieldState },
    country: { ...initialFieldState },
    currency: { ...initialFieldState },
    acName: { ...initialFieldState },
    acType: { ...initialFieldState }
  },
  bank_fields: {
    firstName: { ...initialFieldState },
    lastName: { ...initialFieldState },
    dob: { ...initialFieldState },
    postalCode: { ...initialFieldState },
    city: { ...initialFieldState },
    addressLine1: { ...initialFieldState },
    state: { ...initialFieldState },
    document: { ...initialFieldState },
    document_back: { ...initialFieldState },
    personalId: { ...initialFieldState },
    businessName: { ...initialValidFieldState },
    businessTaxId: { ...initialValidFieldState }
  },
  rememberMe: false,
  submitting: false,
  submitted: false,
  valid: true,
  statusText: "",
  hideModal: false,
  bankInfo: [],
  document: false,
  document_back: false
});

function handleField(state, action) {
  switch (action.type) {
    case VALIDATE: {
      return {
        ...state,
        validated: false,
        validating: true,
        errors: []
      };
    }
    case CHANGE_VALUE: {
      const { value } = action;

      return {
        ...state,
        value
      };
    }
    case SET_INVALID: {
      const { error } = action;
      return {
        ...state,
        validating: false,
        validated: true,
        errors: state.errors.concat(error)
      };
    }
    case SET_VALID: {
      const { error } = action;
      return {
        ...state,
        validating: false,
        validated: true,
        errors: state.errors.filter(e => e !== error)
      };
    }
    default:
      return state;
  }
}
function formatDate(date) {
  if (date) {
    const dateValue = date ? date.split("-") : "";
    const newDate =
      dateValue && dateValue.length
        ? `${dateValue[2]}-${dateValue[1]}-${dateValue[0]}`
        : "";
    return newDate;
  }
}
function CreateAccountReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_VALUE:
    case SET_VALID:
    case SET_INVALID:
    case VALIDATE:
      const { field, module } = action;
      const handledField = handleField(state.toJS()[module][field], action);
      const fields = state.get(module).setIn([field], handledField);
      const valid = Object.keys(fields.toJS()).every(name => {
        return fields.toJS()[name].errors.length === 0;
      });

      return state.set(module, fields).set("valid", valid);
    case CLOSE_MODAL:
      return state.set("hideModal", true);
    case CLEAR_CURRENT_ACCOUNT:
      return initialState;
    case SET_UPLOAD_DOCUMENT:
      const { documentType } = action;
      return state.set(documentType, true);
    case SET_BANK_DETAILS:
      const { data } = action;
      return state
        .setIn(["fields", "acNumber"], {
          value: `**********${data.last4}`,
          validated: true,
          validating: true,
          errors: []
        })
        .setIn(["fields", "routingNumber"], {
          value: data.routing_number,
          validated: true,
          validating: true,
          errors: []
        })
        .setIn(["fields", "currency"], {
          value: data.currency,
          validated: true,
          validating: true,
          errors: []
        })
        .setIn(["fields", "country"], {
          value: data.country,
          validated: true,
          validating: true,
          errors: []
        })
        .setIn(["fields", "acName"], {
          value: data.account_holder_name,
          validated: true,
          validating: true,
          errors: []
        })
        .setIn(["fields", "acType"], {
          value: data.account_holder_type,
          validated: true,
          validating: true,
          errors: []
        })
        .setIn(["bank_fields", "firstName"], {
          value: data.accountInfo.firstName,
          validated: true,
          validating: true,
          errors: []
        })
        .setIn(["bank_fields", "lastName"], {
          value: data.accountInfo.lastName,
          validated: true,
          validating: true,
          errors: []
        })
        .setIn(["bank_fields", "dob"], {
          value: formatDate(data.accountInfo.dob),
          validated: true,
          validating: true,
          errors: []
        })
        .setIn(["bank_fields", "postalCode"], {
          value: data.accountInfo.postalCode,
          validated: true,
          validating: true,
          errors: []
        })
        .setIn(["bank_fields", "businessTaxId"], {
          value: data.accountInfo.businessTaxId,
          validated: true,
          validating: true,
          errors: []
        })
        .setIn(["bank_fields", "businessName"], {
          value: data.accountInfo.businessName,
          validated: true,
          validating: true,
          errors: []
        })
        .setIn(["bank_fields", "businessTaxId"], {
          value: data.accountInfo.businessTaxId,
          validated: true,
          validating: true,
          errors: []
        })
        .setIn(["bank_fields", "businessName"], {
          value: data.accountInfo.businessName,
          validated: true,
          validating: true,
          errors: []
        })
        .setIn(["bank_fields", "document"], {
          value: data.accountInfo.document,
          validated: true,
          validating: true,
          errors: []
        })
        .setIn(["bank_fields", "document_back"], {
          value: data.accountInfo.document_back,
          validated: true,
          validating: true,
          errors: []
        })
        .setIn(["bank_fields", "personalId"], {
          value: data.accountInfo.personalId,
          validated: true,
          validating: true,
          errors: []
        })
        .setIn(["bank_fields", "city"], {
          value: data.accountInfo.city,
          validated: true,
          validating: true,
          errors: []
        })
        .setIn(["bank_fields", "state"], {
          value: data.accountInfo.state,
          validated: true,
          validating: true,
          errors: []
        })
        .setIn(["bank_fields", "addressLine1"], {
          value: data.accountInfo.addressLine1,
          validated: true,
          validating: true,
          errors: []
        })

        .set("bankInfo", data);
    default:
      return state;
  }
}

export default CreateAccountReducer;
